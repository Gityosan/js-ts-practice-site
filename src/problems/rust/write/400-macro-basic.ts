import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-macro-rules-basic",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "はじめての macro_rules!",
    prompt: `## やること

次の 2 つの宣言的マクロを完成させよう。

### \`square!(式)\`

式の 2 乗を返す。**式は 1 回だけ評価** すること（\`{ let v = $x; v * v }\` の形にする）。

\`\`\`rust
square!(4)      // 16
square!(1 + 2)  // 9
\`\`\`

### \`greet!()\` / \`greet!(名前)\`

腕（パターン）を 2 つ書く。

\`\`\`rust
greet!()         // "Hello, world!"（String）
greet!("Rust")   // "Hello, Rust!"
\`\`\`

## 書き方

\`\`\`rust
macro_rules! 名前 {
    (パターン1) => { 展開後のコード };
    (パターン2) => { 展開後のコード };
}
\`\`\`

\`$x:expr\` で式を受け取り、展開側では \`$x\` と書く。`,
    hints: [
      "`($x:expr) => {{ let v = $x; v * v }};` のように展開側を二重の波括弧にすると 1 つのブロック式になる",
      '`() => { String::from("Hello, world!") };`',
      '`($name:expr) => { format!("Hello, {}!", $name) };`',
    ],
  },
  initialCode: `macro_rules! square {
    ($x:expr) => {
        todo!()
    };
}

macro_rules! greet {
    () => {
        todo!()
    };
}
`,
  solutionCode: `macro_rules! square {
    ($x:expr) => {{
        let v = $x;
        v * v
    }};
}

macro_rules! greet {
    () => {
        String::from("Hello, world!")
    };
    ($name:expr) => {
        format!("Hello, {}!", $name)
    };
}
`,
});
