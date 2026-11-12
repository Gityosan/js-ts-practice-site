import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-control-flow",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "制御フロー（if / loop / while / for）",
    prompt: `## if 式

\`\`\`rust
let n = 7;
if n % 2 == 0 {
    println!("偶数");
} else {
    println!("奇数");
}
\`\`\`

- 条件を \`( )\` で囲まなくてよい（囲むと警告が出る）
- \`{ }\` は省略できない（1 行でも必須）
- **条件は必ず \`bool\`**。JS のように \`if n { }\` と数値を書くと E0308 エラー。\`if n != 0 { }\` と書く

### else if

\`\`\`rust
fn grade(score: u32) -> char {
    if score >= 90 {
        'A'
    } else if score >= 70 {
        'B'
    } else if score >= 50 {
        'C'
    } else {
        'D'
    }
}
\`\`\`

上から順に判定され、最初に true になった枝だけが実行される。枝が多くなるときは後で学ぶ \`match\` の方がすっきりすることが多い。

### if は「式」なので値を返せる

\`\`\`rust
let n = -3;
let sign = if n >= 0 { "正またはゼロ" } else { "負" };
\`\`\`

JS の三項演算子 \`cond ? a : b\` に当たるものは Rust にはなく、\`if\` 式で書く。
このとき **すべての枝の型が同じ** でなければならない。

\`\`\`rust
let x = if true { 5 } else { "six" }; // NG: E0308（i32 と &str）
\`\`\`

\`else\` のない \`if\` は値 \`()\` を返すので、値として使うなら \`else\` が必須。

## loop（無限ループ）

\`\`\`rust
let mut count = 0;
loop {
    count += 1;
    if count == 3 {
        break;   // ループを抜ける
    }
}
\`\`\`

\`break\` で抜けるまで何度でも繰り返す。\`continue\` は残りを飛ばして次の周回へ進む。

### break で値を返す

\`loop\` は式で、**\`break 値;\` の値がループ全体の値** になる。

\`\`\`rust
let mut counter = 0;
let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2;
    }
};
println!("{result}"); // 20
\`\`\`

「条件を満たすまで試して、見つかった値を返す」処理に便利。

## ラベル付きループ

ループが入れ子になっているとき、\`break\` / \`continue\` は **一番内側** のループに効く。
外側を抜けたいときは、ループに \`'名前:\` のラベルを付けて指定する。

\`\`\`rust
let mut found = (0, 0);
'outer: for a in 1..10 {
    for b in 1..10 {
        if a * b == 24 {
            found = (a, b);
            break 'outer;       // 外側のループごと抜ける
        }
    }
}
println!("{:?}", found); // (3, 8)
\`\`\`

\`continue 'outer;\` なら外側のループの次の周回へ進む。ラベル名は \`'\` で始める。

## while（条件ループ）

\`\`\`rust
let mut n = 3;
while n > 0 {
    println!("{n}!");
    n -= 1;
}
println!("発射！");
\`\`\`

条件が true の間だけ繰り返す。\`loop\` + \`if\` + \`break\` を短く書いたもの。

## for（コレクション・範囲を回す）

**Rust で一番よく使うループ**。配列などの要素を順に取り出す。

\`\`\`rust
let a = [10, 20, 30];
for x in a {
    println!("{x}");
}
\`\`\`

\`while\` と添字（\`a[i]\`）で回すより、for の方が **範囲外アクセスの心配がなく、速い**。

### 範囲（Range）

| 書き方 | 意味 | 例 |
|---|---|---|
| \`a..b\` | a 以上 b **未満** | \`1..4\` → 1, 2, 3 |
| \`a..=b\` | a 以上 b **以下** | \`1..=4\` → 1, 2, 3, 4 |
| \`(a..b).rev()\` | 逆順 | \`(1..4).rev()\` → 3, 2, 1 |
| \`(a..b).step_by(k)\` | k 個おき | \`(0..10).step_by(3)\` → 0, 3, 6, 9 |

\`\`\`rust
for i in 1..=5 {
    print!("{i} ");         // 1 2 3 4 5
}
for i in (1..=3).rev() {
    println!("{i}...");     // 3... 2... 1...
}
for i in (0..=10).step_by(5) {
    println!("{i}");        // 0 5 10
}
\`\`\`

- 範囲の端に変数も使える: \`for i in 0..n\`
- 回数だけ必要で値を使わないときは \`for _ in 0..3\`
- 開始が終了以上の範囲（\`5..5\` や \`5..1\`）は **1 回も回らない**（逆順にはならない）
- \`(1..4).rev()\` のように **範囲を丸括弧で囲んでから** メソッドを呼ぶ

### 添字と要素を両方使う

\`\`\`rust
let names = ["a", "b", "c"];
for (i, name) in names.iter().enumerate() {
    println!("{i}: {name}");   // 0: a / 1: b / 2: c
}
\`\`\`

## ループの使い分け

| ループ | 使う場面 |
|---|---|
| \`for\` | 範囲・配列・コレクションを順に処理する（基本はこれ） |
| \`while\` | 「条件が成り立つ間」繰り返す。回数が事前に分からない |
| \`loop\` | 無限ループ、または break で値を返したいとき |

\`for\` と \`while\` は値を返さない（式としての値は \`()\`）。\`break 値\` が使えるのは \`loop\` だけ。`,
    hints: [
      "if は式。値として使うときは全部の枝で同じ型にし、else を書く。",
      "条件は必ず bool。数値を直接 if に書けない。",
      "`loop` は `break 値;` で値を返せる。入れ子は `'label:` で外側を指定。",
      "`1..n` は n を含まない、`1..=n` は含む。逆順は `.rev()`、飛ばしは `.step_by(k)`。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "このコードがコンパイルエラーになる理由は？",
        snippet: `let n = 3;
if n {
    println!("nonzero");
}
`,
        choices: [
          "if の条件が bool ではなく整数だから",
          "条件を ( ) で囲んでいないから",
          "else がないから",
          "println! の後ろに ; があるから",
        ],
        answer: "if の条件が bool ではなく整数だから",
        explain: "Rust に truthy / falsy はない。`if n != 0` のように bool の式を書く。",
      },
      {
        prompt: "`result` の値は？",
        snippet: `let mut i = 1;
let result = loop {
    i *= 2;
    if i > 20 {
        break i;
    }
};
`,
        choices: ["32", "16", "20", "()"],
        answer: "32",
        explain:
          "i は 2, 4, 8, 16, 32 と増え、32 > 20 で `break i;` によりループの値が 32 になる。",
      },
      {
        prompt: "`for i in 1..5` で i がとる値は？",
        choices: ["1, 2, 3, 4", "1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "2, 3, 4, 5"],
        answer: "1, 2, 3, 4",
        explain: "`a..b` は b を含まない。5 も含めたいなら `1..=5`。",
      },
      {
        prompt: "`for i in (1..=10).rev().step_by(3)` で i がとる値は？",
        choices: ["10, 7, 4, 1", "1, 4, 7, 10", "10, 7, 4", "9, 6, 3"],
        answer: "10, 7, 4, 1",
        explain: "まず 10 から 1 への逆順にし、そこから 3 個おきに取る。",
      },
      {
        prompt: "入れ子のループで、内側から **外側のループごと** 抜ける方法は？",
        choices: [
          "外側に `'outer:` とラベルを付けて `break 'outer;`",
          "`break 2;` と書く",
          "`return` 以外に方法はない",
          "`continue;` を 2 回書く",
        ],
        answer: "外側に `'outer:` とラベルを付けて `break 'outer;`",
        explain:
          "ラベル付き break / continue で、どのループに効かせるかを指定できる。`break 2` は「2 という値を返して抜ける」意味になる。",
      },
      {
        prompt: "このコードがコンパイルエラーになる理由は？",
        snippet: `let x = 10;
let label = if x > 5 { "big" } else { 0 };
`,
        choices: [
          "if と else の枝で値の型が違うから",
          "if を式として使うことはできないから",
          "else if が必要だから",
          "label に型注釈がないから",
        ],
        answer: "if と else の枝で値の型が違うから",
        explain: 'if 式は全ての枝が同じ型の値を返す必要がある。"big" は &str、0 は整数。',
      },
      {
        prompt: "`break 値;` で値を返せるループは？",
        choices: ["loop だけ", "for だけ", "while と loop", "for / while / loop すべて"],
        answer: "loop だけ",
        explain:
          "for と while は条件によって 1 回も回らないことがあり、そのとき返す値がないため値付き break は使えない。",
      },
    ],
  },
});
