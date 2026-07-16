// 解読(decoding)教材の心臓部。
// コードを「予約語(closed-class) / 名前(open-class) / 括弧 / 記号 / 型 / リテラル」に分解し、
// さらに「直前のキーワードが ( ) { } の意味を確定させる」(SPEC §1.3) を機械的に説明する。

export type TokenType =
  | "keyword" // 予約語（const, if, function, return …）= closed-class・構造
  | "type" // 型注釈に現れる語（number, string …）
  | "identifier" // 自分で付けた名前 = open-class・意味を運ぶ
  | "string"
  | "number"
  | "comment"
  | "operator" // = + - * / && === => …
  | "punct" // , ; : ... （区切り）
  | "bracket" // ( ) [ ] { }
  | "whitespace";

export type Token = {
  type: TokenType;
  value: string;
  start: number; // ソース内の文字オフセット
  index: number; // tokens 配列内の位置
};

/** closed-class = 有限・構造を作る機能語（紫で教える側） */
export function isClosedClass(t: TokenType): boolean {
  return t === "keyword" || t === "bracket" || t === "operator" || t === "punct";
}

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "default",
  "break",
  "continue",
  "of",
  "in",
  "new",
  "class",
  "extends",
  "import",
  "export",
  "from",
  "as",
  "await",
  "async",
  "yield",
  "this",
  "typeof",
  "instanceof",
  "void",
  "delete",
  "throw",
  "try",
  "catch",
  "finally",
  "true",
  "false",
  "null",
  "undefined",
  "interface",
  "type",
]);

// 型注釈の文脈で現れやすい語。識別子として使われることは学習コードではほぼ無い。
const TYPE_WORDS = new Set([
  "number",
  "string",
  "boolean",
  "any",
  "unknown",
  "never",
  "object",
  "symbol",
  "bigint",
]);

// bash 用の予約語（closed-class）。関数名・コマンド名（echo など）は含めない＝open-class として扱う。
const BASH_KEYWORDS = new Set([
  "if",
  "then",
  "elif",
  "else",
  "fi",
  "for",
  "in",
  "do",
  "done",
  "while",
  "until",
  "case",
  "esac",
  "function",
  "select",
  "time",
  "return",
  "break",
  "continue",
  "local",
  "export",
  "readonly",
  "true",
  "false",
]);

const OPS3 = new Set(["===", "!==", "**=", "&&=", "||=", "??=", ">>>"]);
const OPS2 = new Set([
  "==",
  "!=",
  "<=",
  ">=",
  "&&",
  "||",
  "??",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "++",
  "--",
  "**",
  "?.",
]);

const isIdStart = (c: string) => /[A-Za-z_$]/.test(c);
const isIdPart = (c: string) => /[A-Za-z0-9_$]/.test(c);

/** ソースをトークン列へ。空白・コメントも保持するので join すれば原文に戻る。 */
export function tokenize(src: string, language: "js" | "bash" = "js"): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = src.length;
  const push = (type: TokenType, value: string, start: number) => {
    tokens.push({ type, value, start, index: tokens.length });
  };
  const isBash = language === "bash";

  while (i < n) {
    const c = src[i];

    if (/\s/.test(c)) {
      let j = i + 1;
      while (j < n && /\s/.test(src[j])) j++;
      push("whitespace", src.slice(i, j), i);
      i = j;
      continue;
    }

    if (isBash && c === "#") {
      let j = i + 1;
      while (j < n && src[j] !== "\n") j++;
      push("comment", src.slice(i, j), i);
      i = j;
      continue;
    }

    // $var / ${...} / $(( ... )) をひとかたまりの「変数参照」トークンにする。
    // 中身（パラメータ展開の演算子や算術式）は分解せず、explainToken 側で意味を説明する。
    if (isBash && c === "$") {
      let j = i + 1;
      if (src[j] === "{") {
        j++;
        while (j < n && src[j] !== "}") j++;
        j = Math.min(n, j + 1);
      } else if (src[j] === "(") {
        let depth = 1;
        j++;
        while (j < n && depth > 0) {
          if (src[j] === "(") depth++;
          else if (src[j] === ")") depth--;
          j++;
        }
      } else if (/[A-Za-z_]/.test(src[j] ?? "")) {
        while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      } else if (/[0-9@#?$!*-]/.test(src[j] ?? "")) {
        j++;
      }
      push("identifier", src.slice(i, j), i);
      i = j;
      continue;
    }

    if (isBash && src.slice(i, i + 2) === "((") {
      push("bracket", "((", i);
      i += 2;
      continue;
    }
    if (isBash && src.slice(i, i + 2) === "))") {
      push("bracket", "))", i);
      i += 2;
      continue;
    }
    if (isBash && src.slice(i, i + 2) === ";;") {
      push("punct", ";;", i);
      i += 2;
      continue;
    }

    if (!isBash && c === "/" && src[i + 1] === "/") {
      let j = i + 2;
      while (j < n && src[j] !== "\n") j++;
      push("comment", src.slice(i, j), i);
      i = j;
      continue;
    }
    if (!isBash && c === "/" && src[i + 1] === "*") {
      let j = i + 2;
      while (j < n && !(src[j] === "*" && src[j + 1] === "/")) j++;
      j = Math.min(n, j + 2);
      push("comment", src.slice(i, j), i);
      i = j;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      while (j < n) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === c) {
          j++;
          break;
        }
        j++;
      }
      push("string", src.slice(i, j), i);
      i = j;
      continue;
    }

    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] ?? ""))) {
      let j = i + 1;
      while (j < n && /[0-9._eExXbBoOa-fA-F]/.test(src[j])) j++;
      push("number", src.slice(i, j), i);
      i = j;
      continue;
    }

    if (isIdStart(c)) {
      let j = i + 1;
      while (j < n && isIdPart(src[j])) j++;
      const word = src.slice(i, j);
      const type: TokenType = isBash
        ? BASH_KEYWORDS.has(word)
          ? "keyword"
          : "identifier"
        : KEYWORDS.has(word)
          ? "keyword"
          : TYPE_WORDS.has(word)
            ? "type"
            : "identifier";
      push(type, word, i);
      i = j;
      continue;
    }

    if ("()[]{}".includes(c)) {
      push("bracket", c, i);
      i++;
      continue;
    }

    if (!isBash && c === "=" && src[i + 1] === ">") {
      push("keyword", "=>", i); // アロー：本体 { } の意味を確定させるので keyword 扱い
      i += 2;
      continue;
    }

    const three = src.slice(i, i + 3);
    if (three === "...") {
      push("punct", "...", i);
      i += 3;
      continue;
    }
    if (OPS3.has(three)) {
      push("operator", three, i);
      i += 3;
      continue;
    }
    const two = src.slice(i, i + 2);
    if (OPS2.has(two)) {
      push("operator", two, i);
      i += 2;
      continue;
    }

    if (",;:".includes(c)) {
      push("punct", c, i);
      i++;
      continue;
    }
    if ("+-*/%=<>!&|?.~^".includes(c)) {
      push("operator", c, i);
      i++;
      continue;
    }

    push("punct", c, i);
    i++;
  }

  return tokens;
}

// 開き→閉じの対応表。bash の (( )) は 2 文字なので値そのもので引く。
const BRACKET_PAIR: Record<string, string> = { "(": ")", "[": "]", "{": "}", "((": "))" };
const BRACKET_OPENS = new Set(Object.keys(BRACKET_PAIR));
const BRACKET_CLOSES = new Set(Object.values(BRACKET_PAIR));

/** 括弧の対応表（開き token.index → 閉じ token.index、双方向） */
export function matchBrackets(tokens: Token[]): Map<number, number> {
  const pairs = new Map<number, number>();
  const stack: { value: string; idx: number }[] = [];
  for (const t of tokens) {
    if (t.type !== "bracket") continue;
    if (BRACKET_OPENS.has(t.value)) {
      stack.push({ value: t.value, idx: t.index });
    } else if (BRACKET_CLOSES.has(t.value)) {
      const top = stack.pop();
      if (top && BRACKET_PAIR[top.value] === t.value) {
        pairs.set(top.idx, t.index);
        pairs.set(t.index, top.idx);
      }
    }
  }
  return pairs;
}

/** idx より前の、空白・コメントを除いた直近トークン */
function prevMeaningful(tokens: Token[], idx: number): Token | null {
  for (let i = idx - 1; i >= 0; i--) {
    const t = tokens[i];
    if (t.type !== "whitespace" && t.type !== "comment") return t;
  }
  return null;
}

// 戻り値型注釈（) : Type）を構成しうるトークン。{ の直前を見るとき読み飛ばす。
const TYPE_ANNOTATION_VALUES = new Set([":", ".", "|", "&", "[", "]", "<", ">", ","]);
function isTypeAnnotationPart(t: Token): boolean {
  return (
    t.type === "type" ||
    t.type === "identifier" ||
    ((t.type === "punct" || t.type === "operator") && TYPE_ANNOTATION_VALUES.has(t.value))
  );
}

/** { の直前を見るとき、戻り値型注釈（): number）を飛ばした実質的な直前トークン */
function effectivePrevForBrace(tokens: Token[], idx: number): Token | null {
  let i = idx - 1;
  // 型注釈の連なり（と途中の空白）を読み飛ばす：) : number の number, : を飛ばして ) に到達
  while (i >= 0) {
    const t = tokens[i];
    if (t.type === "whitespace" || t.type === "comment" || isTypeAnnotationPart(t)) {
      i--;
      continue;
    }
    break;
  }
  return i >= 0 ? tokens[i] : null;
}

/** 閉じ ) の token.index から対応する ( を探し、その直前が制御構文キーワードなら返す */
function ctrlKeywordBeforeParen(tokens: Token[], closeIdx: number): string | null {
  let depth = 0;
  let openIdx = -1;
  for (let i = closeIdx; i >= 0; i--) {
    const t = tokens[i];
    if (t.type !== "bracket") continue;
    if (t.value === ")") depth++;
    else if (t.value === "(") {
      depth--;
      if (depth === 0) {
        openIdx = i;
        break;
      }
    }
  }
  if (openIdx < 0) return null;
  const before = prevMeaningful(tokens, openIdx);
  if (before?.type === "keyword" && ["if", "while", "for", "switch"].includes(before.value)) {
    return before.value;
  }
  return null;
}

/** 開き ( の token.index から対応する ) の index を前方探索 */
function matchParenForward(tokens: Token[], openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type !== "bracket") continue;
    if (t.value === "(") depth++;
    else if (t.value === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** idx より後の、空白・コメントを除いた直近トークン */
function prevAfter(tokens: Token[], idx: number): Token | null {
  for (let i = idx + 1; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type !== "whitespace" && t.type !== "comment") return t;
  }
  return null;
}

const KEYWORD_DESC: Record<string, string> = {
  const: "再代入できない変数を宣言する予約語。",
  let: "あとで再代入できる変数を宣言する予約語。",
  var: "古い変数宣言。今は const / let を使う。",
  function: "関数を作る予約語。直後の ( ) は『引数の定義』になる。",
  return: "関数から値を返す予約語。",
  if: "条件分岐の予約語。直後の ( ) は『条件式』になる。",
  else: "if が成り立たなかったときの処理。",
  for: "繰り返しの予約語。( ) はループのヘッダ（初期化・条件・更新）。",
  while: "条件が真の間くり返す予約語。( ) は『条件式』。",
  of: "for…of：配列などの中身を 1 つずつ取り出す。",
  in: "for…in：オブジェクトのキーを取り出す / プロパティ存在判定。",
  return_: "",
  "=>": "アロー関数。直後の { } は『関数の本体』になる。",
  new: "クラスからインスタンスを作る予約語。",
  class: "クラスを定義する予約語。直後の { } は『クラス本体』。",
  true: "真偽値リテラル（はい）。",
  false: "真偽値リテラル（いいえ）。",
  null: "「値が無い」を表す。",
  undefined: "「まだ値が決まっていない」を表す。",
  typeof: "値の種類を文字列で返す演算子。",
  await: "非同期処理の完了を待つ予約語。",
  async: "非同期関数を表す予約語。",
  interface: "TypeScript の型の形を定義する予約語。",
  type: "TypeScript の型に別名を付ける予約語。",
};

export type TokenExplain = {
  /** 凡例カテゴリ見出し */
  category: string;
  /** open/closed の別。色分けの教育に使う */
  klass: "closed" | "open" | "literal" | "type" | "neutral";
  /** 説明本文 */
  detail: string;
};

/**
 * 1 トークンの役割を説明する。括弧は「直前のキーワードが意味を確定させる」(SPEC §1.3) を実装。
 */
export function explainToken(
  tokens: Token[],
  idx: number,
  language: "js" | "bash" = "js",
): TokenExplain {
  if (language === "bash") return explainBashToken(tokens, idx);
  const t = tokens[idx];
  switch (t.type) {
    case "keyword": {
      return {
        category: "予約語（closed-class・構造）",
        klass: "closed",
        detail: KEYWORD_DESC[t.value] ?? "JS/TS にあらかじめ決まっている、構造を作る言葉。",
      };
    }
    case "type":
      return {
        category: "型注釈",
        klass: "type",
        detail: `\`${t.value}\` は「この値は ${t.value} ですよ」という型の注釈。読むときは飾りとして読み飛ばしてもいい。`,
      };
    case "identifier":
      return {
        category: "名前（open-class・意味を運ぶ）",
        klass: "open",
        detail:
          "自分で付けた名前（変数名・関数名）。無限に作れる。骨格を読むだけなら、中身の意味は気にしなくていい。",
      };
    case "string":
      return { category: "文字列リテラル", klass: "literal", detail: "そのままの文字データ。" };
    case "number":
      return { category: "数値リテラル", klass: "literal", detail: "そのままの数値データ。" };
    case "comment":
      return { category: "コメント", klass: "neutral", detail: "実行されないメモ書き。" };
    case "operator":
      return {
        category: "演算子（closed-class）",
        klass: "closed",
        detail: describeOperator(t.value),
      };
    case "punct":
      return {
        category: "区切り記号（closed-class）",
        klass: "closed",
        detail: describePunct(t.value),
      };
    case "bracket":
      return describeBracket(tokens, idx);
    default:
      return { category: "", klass: "neutral", detail: "" };
  }
}

function describeOperator(v: string): string {
  const map: Record<string, string> = {
    "=": "代入。右の値を左の名前に入れる。",
    "===": "厳密な等しい（型も値も同じか）。",
    "!==": "厳密な等しくない。",
    "==": "等しい（型を変換して比較・非推奨）。",
    "+": "足し算、または文字列の連結。",
    "-": "引き算。",
    "*": "掛け算。",
    "/": "割り算。",
    "%": "余り。",
    "<": "より小さい。",
    ">": "より大きい。",
    "<=": "以下。",
    ">=": "以上。",
    "&&": "かつ（両方が真）。",
    "||": "または（どちらかが真）。",
    "?.": "オプショナルチェーン。null/undefined なら止まる。",
    "??": "左が null/undefined のときだけ右を使う。",
  };
  return map[v] ?? "値を計算・比較する記号。";
}

function describePunct(v: string): string {
  const map: Record<string, string> = {
    ",": "区切り。引数や要素を並べる。",
    ";": "文の終わり。",
    ":": "型注釈やオブジェクトのキーと値を区切る。",
    "...": "スプレッド / レスト。配列やオブジェクトを展開する。",
  };
  return map[v] ?? "区切り記号。";
}

/** ( ) [ ] { } の役割を、直前のキーワードから判定する（SPEC §1.3 の核） */
function describeBracket(tokens: Token[], idx: number): TokenExplain {
  const t = tokens[idx];
  const prev = prevMeaningful(tokens, idx);
  const pv = prev?.value ?? "";
  const base = { category: "括弧（closed-class・構造の骨）", klass: "closed" as const };

  // 開き括弧で意味を判定（閉じはペア側に委ねる）
  if (t.value === "(") {
    if (prev?.type === "keyword" && (pv === "if" || pv === "while" || pv === "switch")) {
      return { ...base, detail: "この ( ) は『条件式』。直前の予約語が意味を決めている。" };
    }
    if (pv === "for") {
      return { ...base, detail: "この ( ) は for ループの『ヘッダ』（初期化・条件・更新）。" };
    }
    if (pv === "function") {
      return { ...base, detail: "この ( ) は『引数の定義』。function の直後だから。" };
    }
    // 対応する ) の直後が => ならアロー関数の引数定義
    const closeIdx = matchParenForward(tokens, idx);
    if (closeIdx >= 0) {
      const after = prevAfter(tokens, closeIdx);
      if (after?.value === "=>") {
        return { ...base, detail: "この ( ) は『アロー関数の引数定義』。直後に => が続くから。" };
      }
    }
    if (prev?.type === "identifier") {
      // function 宣言の引数定義か、ただの呼び出しか
      const beforeName = prev ? prevMeaningful(tokens, prev.index) : null;
      if (beforeName?.value === "function") {
        return { ...base, detail: "この ( ) は『引数の定義』（function 名前(...) の形）。" };
      }
      return { ...base, detail: "この ( ) は『関数の呼び出し』。名前の直後に来ているから。" };
    }
    return { ...base, detail: "この ( ) は『グループ化』。計算の優先順位をまとめる。" };
  }

  if (t.value === "{") {
    if (pv === "=>")
      return { ...base, detail: "この { } は『関数の本体』。アロー => の直後だから。" };
    const eff = effectivePrevForBrace(tokens, idx);
    if (eff?.value === ")") {
      // ) の前を辿って if/while/for なら制御ブロック、それ以外は関数本体
      const head = ctrlKeywordBeforeParen(tokens, eff.index);
      if (head)
        return {
          ...base,
          detail: `この { } は ${head} の『本体（ブロック）』。条件が成り立つと実行される。`,
        };
      return {
        ...base,
        detail: "この { } は『関数の本体』。引数 ( ) の直後だから（戻り値型注釈があっても本体）。",
      };
    }
    if (pv === "=" || pv === "(" || pv === "," || pv === "return" || pv === ":") {
      return {
        ...base,
        detail: "この { } は『オブジェクトリテラル』。= や ( , の直後で値として置かれているから。",
      };
    }
    if (
      prev?.type === "keyword" &&
      (pv === "else" || pv === "do" || pv === "try" || pv === "finally")
    ) {
      return { ...base, detail: "この { } は処理をまとめる『ブロック』。" };
    }
    if (pv === "class" || pv === "interface") {
      return { ...base, detail: `この { } は『${pv} の本体』。` };
    }
    if (prev?.type === "identifier") {
      const beforeName = prev ? prevMeaningful(tokens, prev.index) : null;
      if (beforeName?.value === "class" || beforeName?.value === "interface") {
        return { ...base, detail: `この { } は『${beforeName.value} の本体』。` };
      }
    }
    return { ...base, detail: "この { } は処理をまとめる『ブロック』。" };
  }

  if (t.value === "[") {
    if (
      prev &&
      (prev.type === "identifier" ||
        prev.value === ")" ||
        prev.value === "]" ||
        prev.type === "string")
    ) {
      return {
        ...base,
        detail: "この [ ] は『要素アクセス』（配列の n 番目・オブジェクトのキー）。",
      };
    }
    return { ...base, detail: "この [ ] は『配列リテラル』。値を並べて配列を作る。" };
  }

  // 閉じ括弧：対応する開きの意味を指す
  return { ...base, detail: "対応する開き括弧とペア。クリックで相方が光る。" };
}

// bash の予約語には本物の "then" があるため、この Record は構造上
// no-thenable 系 lint の誤検出（thenable object 疑い）に引っかかるが実害はない。
const BASH_KEYWORD_DESC: Record<string, string> = {
  if: "条件分岐の予約語。then から fi までが 1 つの if 文。",
  then: "条件が真のときの処理の始まり。",
  elif: "else if。前の条件が偽なら次はこれを判定する。",
  else: "どの条件にも当てはまらなかったときの処理。",
  fi: "if の終わりを示す（if を逆から読んだ形）。",
  for: "繰り返しの予約語。in の後ろの並びを 1 つずつ変数に入れる。",
  in: "for ... in / case ... in で使う。繰り返す対象や分岐の的を示す。",
  do: "for / while の繰り返し本体の始まり。",
  done: "for / while の終わりを示す（do を逆から読んだ形）。",
  while: "条件が真の間くり返す予約語。",
  until: "条件が偽の間くり返す予約語（while の逆）。",
  case: "値によって分岐する予約語。esac までが 1 つの case 文。",
  esac: "case の終わりを示す（case を逆から読んだ形）。",
  function: "関数を定義する予約語（`name() { ... }` の形なら省略できる）。",
  select: "メニュー選択の繰り返しを作る予約語。",
  time: "直後のコマンドの実行時間を計測する予約語。",
  return: "関数の終了コード（数値）を返す予約語。",
  break: "ループを途中で抜ける予約語。",
  continue: "ループの次の周回に進む予約語。",
  local: "関数の中だけで使える変数を宣言する予約語。",
  export: "変数を子プロセスにも見えるようにする予約語。",
  readonly: "変数を再代入できなくする予約語。",
  true: "常に成功（終了コード 0）を返すコマンド。",
  false: "常に失敗（終了コード 1）を返すコマンド。",
};

function explainBashToken(tokens: Token[], idx: number): TokenExplain {
  const t = tokens[idx];
  switch (t.type) {
    case "keyword":
      return {
        category: "予約語（closed-class・構造）",
        klass: "closed",
        detail: BASH_KEYWORD_DESC[t.value] ?? "bash にあらかじめ決まっている、構造を作る言葉。",
      };
    case "identifier":
      return describeBashIdentifier(t.value);
    case "string":
      return { category: "文字列リテラル", klass: "literal", detail: "そのままの文字データ。" };
    case "number":
      return { category: "数値リテラル", klass: "literal", detail: "そのままの数値データ。" };
    case "comment":
      return {
        category: "コメント",
        klass: "neutral",
        detail: "実行されないメモ書き（# から行末まで）。",
      };
    case "operator":
      return {
        category: "演算子（closed-class）",
        klass: "closed",
        detail: describeBashOperator(t.value),
      };
    case "punct":
      return {
        category: "区切り記号（closed-class）",
        klass: "closed",
        detail: describeBashPunct(t.value),
      };
    case "bracket":
      return describeBracketBash(tokens, idx);
    default:
      return { category: "", klass: "neutral", detail: "" };
  }
}

function describeBashIdentifier(value: string): TokenExplain {
  if (value.startsWith("$((")) {
    return {
      category: "算術式展開（open-class・値を運ぶ）",
      klass: "open",
      detail:
        "`$(( ))` は中の計算結果を値として返す。`(( ))`（$ なし）は真偽の判定、`$(( ))` は値そのもの。",
    };
  }
  if (value.startsWith("${")) {
    return {
      category: "パラメータ展開",
      klass: "open",
      detail: "`${ }` は変数の中身を加工して取り出す（長さ・置換・デフォルト値など）。",
    };
  }
  if (value.startsWith("$")) {
    return {
      category: "変数参照（open-class・意味を運ぶ）",
      klass: "open",
      detail: `\`$\` は変数の中身を読み出す記号。\`${value}\` は変数 \`${value.slice(1)}\` の値を展開する。`,
    };
  }
  return {
    category: "名前（open-class・意味を運ぶ）",
    klass: "open",
    detail:
      "自分で付けた名前、またはコマンド名（echo など）。骨格を読むだけなら中身の意味は気にしなくていい。",
  };
}

function describeBashOperator(v: string): string {
  const map: Record<string, string> = {
    "=": "代入。変数に値を入れる（bash では = の前後にスペースを入れない）。",
    "==": "文字列や数値が等しいか比較する（[[ ]] や (( )) の中で使う）。",
    "!=": "等しくないかを比較する。",
    "<=": "以下。",
    ">=": "以上。",
    "&&": "かつ。前のコマンドが成功したら次を実行する。",
    "||": "または。前のコマンドが失敗したら次を実行する。",
    "%": "余り（(( )) の中で使う算術演算子）。",
    "*": "掛け算、または case パターンの『どんな文字列にも一致する』ワイルドカード。",
    "+": "足し算。",
    "-": "引き算、またはパラメータ展開のデフォルト値指定（${var:-default}）。",
    "/": "割り算、またはパラメータ展開の置換（${var/a/b}）。",
    "!": "否定（コマンドの終了コードを反転する）。",
  };
  return map[v] ?? "値を計算・比較する記号。";
}

function describeBashPunct(v: string): string {
  const map: Record<string, string> = {
    ";": "コマンドの区切り（改行と同じ意味）。",
    ";;": "case の 1 つの分岐（パターン）の終わり。次のパターンの判定に進む。",
    ":": "パラメータ展開の中でデフォルト値などを区切る記号（${var:-default} など）。",
    ",": "区切り記号。",
  };
  return map[v] ?? "区切り記号。";
}

/** 開き ( の token.index から対応する ) の index を後方から逆探索（bash 用の単純版） */
function matchParenBackward(tokens: Token[], closeIdx: number): number {
  let depth = 0;
  for (let i = closeIdx; i >= 0; i--) {
    const t = tokens[i];
    if (t.type !== "bracket" || t.value === "((" || t.value === "))") continue;
    if (t.value === ")") depth++;
    else if (t.value === "(") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** bash の ( ) { } (( )) の役割を判定する（JS 版とは意味体系が異なるため独立実装） */
function describeBracketBash(tokens: Token[], idx: number): TokenExplain {
  const t = tokens[idx];
  const prev = prevMeaningful(tokens, idx);
  const pv = prev?.value ?? "";
  const base = { category: "括弧（closed-class・構造の骨）", klass: "closed" as const };

  if (t.value === "((") {
    return {
      ...base,
      detail: "この (( )) は算術式（計算・比較）を評価する場所。中では $ を付けずに変数を使える。",
    };
  }
  if (t.value === "))") {
    return { ...base, detail: "対応する (( とペア。算術式の評価はここまで。" };
  }
  if (t.value === "(") {
    if (prev?.type === "identifier") {
      return {
        ...base,
        detail:
          "この ( ) は関数定義の引数リスト。bash では基本 () を空にする（引数は $1 $2 ... で受け取る）。",
      };
    }
    return { ...base, detail: "この ( ) はサブシェル、またはグループ化。" };
  }
  if (t.value === "{") {
    if (pv === ")") {
      return { ...base, detail: "この { } は関数の本体。直前の ( ) が引数リストだから。" };
    }
    return { ...base, detail: "この { } は処理をまとめる本体・ブロック。" };
  }
  if (t.value === "}") {
    return { ...base, detail: "対応する開き { とペア。関数やブロックの終わり。" };
  }
  if (t.value === ")") {
    const openIdx = matchParenBackward(tokens, idx);
    if (openIdx < 0) {
      return {
        ...base,
        detail: "この ) は ( とペアではない。case の 1 つのパターンを閉じる記号（bash 独特の書き方）。",
      };
    }
    return { ...base, detail: "対応する開き ( とペア。クリックで相方が光る。" };
  }
  if (t.value === "[") {
    return {
      ...base,
      detail: "配列、またはテストコマンドの目印（例: [ $n -ge 18 ] は test コマンドの別名）。",
    };
  }
  return { ...base, detail: "対応する開き括弧とペア。クリックで相方が光る。" };
}
