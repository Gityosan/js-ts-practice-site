import { describe, it, expect } from "vitest";
import { tokenize, matchBrackets, explainToken } from "../lib/tokenize";

/** code 内 n 番目（0始まり）の指定文字の token.index を返す */
function bracketIndex(code: string, ch: string, nth: number): number {
  const toks = tokenize(code);
  const hits = toks.filter((t) => t.type === "bracket" && t.value === ch);
  return hits[nth].index;
}

describe("tokenize: 分類", () => {
  it("予約語と名前を区別する", () => {
    const toks = tokenize("const total = price;").filter((t) => t.type !== "whitespace");
    expect(toks.find((t) => t.value === "const")?.type).toBe("keyword");
    expect(toks.find((t) => t.value === "total")?.type).toBe("identifier");
    expect(toks.find((t) => t.value === "price")?.type).toBe("identifier");
  });

  it("型注釈の語を type として分類する", () => {
    const toks = tokenize("function f(n: number) {}");
    expect(toks.find((t) => t.value === "number")?.type).toBe("type");
  });

  it("join で原文に戻る（空白・記号を保持）", () => {
    const src = `if (x > 1) {\n  return "ok";\n}`;
    expect(
      tokenize(src)
        .map((t) => t.value)
        .join(""),
    ).toBe(src);
  });
});

describe("matchBrackets: 対応付け", () => {
  it("入れ子の括弧を正しくペアにする", () => {
    const code = "f(g(x))";
    const toks = tokenize(code);
    const pairs = matchBrackets(toks);
    const opens = toks.filter((t) => t.value === "(");
    const closes = toks.filter((t) => t.value === ")");
    // 外側の ( は 最後の ) と対応
    expect(pairs.get(opens[0].index)).toBe(closes[1].index);
    expect(pairs.get(opens[1].index)).toBe(closes[0].index);
  });
});

describe("explainToken: キーワードが括弧の意味を確定させる (SPEC §1.3)", () => {
  it("function 名前( ) は引数定義", () => {
    const code = "function double(n: number): number { return n * 2; }";
    expect(explainToken(tokenize(code), bracketIndex(code, "(", 0)).detail).toContain("引数の定義");
  });

  it("戻り値型注釈があっても ) の後の { } は関数の本体", () => {
    const code = "function double(n: number): number { return n; }";
    expect(explainToken(tokenize(code), bracketIndex(code, "{", 0)).detail).toContain("関数の本体");
  });

  it("if ( ) は条件式、その後の { } は本体", () => {
    const code = 'if (price > 1000) { label = "高"; }';
    expect(explainToken(tokenize(code), bracketIndex(code, "(", 0)).detail).toContain("条件式");
    expect(explainToken(tokenize(code), bracketIndex(code, "{", 0)).detail).toContain("本体");
  });

  it("名前( ) は関数の呼び出し", () => {
    const code = "const r = double(price);";
    expect(explainToken(tokenize(code), bracketIndex(code, "(", 0)).detail).toContain("呼び出し");
  });

  it("= { } はオブジェクトリテラル", () => {
    const code = 'const user = { name: "田中" };';
    expect(explainToken(tokenize(code), bracketIndex(code, "{", 0)).detail).toContain(
      "オブジェクトリテラル",
    );
  });

  it("() => { } はアロー引数と関数本体", () => {
    const code = "const f = () => { return 1; };";
    expect(explainToken(tokenize(code), bracketIndex(code, "(", 0)).detail).toContain("アロー");
    expect(explainToken(tokenize(code), bracketIndex(code, "{", 0)).detail).toContain("関数の本体");
  });
});

describe("tokenize: bash 言語", () => {
  it("bash の予約語と識別子（コマンド名）を区別する", () => {
    const toks = tokenize('if (( n % 2 == 0 )); then echo "even"; fi', "bash").filter(
      (t) => t.type !== "whitespace",
    );
    expect(toks.find((t) => t.value === "if")?.type).toBe("keyword");
    expect(toks.find((t) => t.value === "then")?.type).toBe("keyword");
    expect(toks.find((t) => t.value === "fi")?.type).toBe("keyword");
    expect(toks.find((t) => t.value === "n")?.type).toBe("identifier");
    expect(toks.find((t) => t.value === "echo")?.type).toBe("identifier");
  });

  it("(( )) をひとまとまりの bracket として扱い、対応付ける", () => {
    const code = "if (( n % 2 == 0 )); then echo ok; fi";
    const toks = tokenize(code, "bash");
    expect(toks.filter((t) => t.value === "((")).toHaveLength(1);
    expect(toks.filter((t) => t.value === "))")).toHaveLength(1);
    const pairs = matchBrackets(toks);
    const open = toks.find((t) => t.value === "((")!;
    const close = toks.find((t) => t.value === "))")!;
    expect(pairs.get(open.index)).toBe(close.index);
  });

  it("(( )) は算術式として説明される", () => {
    const code = "if (( n % 2 == 0 )); then echo ok; fi";
    const toks = tokenize(code, "bash");
    const openIdx = toks.findIndex((t) => t.value === "((");
    expect(explainToken(toks, openIdx, "bash").detail).toContain("算術式");
  });

  it("$var は変数参照として説明される", () => {
    const code = "case $n in\n  1) echo ok ;;\nesac";
    const toks = tokenize(code, "bash");
    const idx = toks.findIndex((t) => t.value === "$n");
    expect(toks[idx].type).toBe("identifier");
    expect(explainToken(toks, idx, "bash").detail).toContain("変数");
  });

  it("case の ) は ( とペアにならず、パターンの終わりとして説明される", () => {
    const code = 'case $n in\n  1) echo "Mon" ;;\n  *) echo "invalid" ;;\nesac';
    const toks = tokenize(code, "bash");
    const closeParens = toks.filter((t) => t.type === "bracket" && t.value === ")");
    expect(closeParens).toHaveLength(2);
    const pairs = matchBrackets(toks);
    for (const t of closeParens) {
      expect(pairs.has(t.index)).toBe(false);
      expect(explainToken(toks, t.index, "bash").detail).toContain("ペアではない");
    }
  });

  it("name() { ... } の ( ) { } は関数定義として説明される", () => {
    const code = `greet() {\n  echo "Hi, $1!"\n}`;
    const toks = tokenize(code, "bash");
    const openParenIdx = toks.findIndex((t) => t.value === "(");
    const braceIdx = toks.findIndex((t) => t.value === "{");
    expect(explainToken(toks, openParenIdx, "bash").detail).toContain("引数リスト");
    expect(explainToken(toks, braceIdx, "bash").detail).toContain("関数の本体");
  });

  it("# から行末まではコメントとして扱う", () => {
    const code = "n=1 # comment";
    const toks = tokenize(code, "bash");
    expect(toks.find((t) => t.value === "# comment")?.type).toBe("comment");
  });
});
