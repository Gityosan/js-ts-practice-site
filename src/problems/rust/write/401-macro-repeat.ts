import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-macro-repetition",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "繰り返し $(...),* で可変個の引数",
    prompt: `## やること

可変個の引数を受け取るマクロを 2 つ作ろう。

### \`sum!(...)\`

すべての引数の合計を返す。引数 0 個なら \`0\`。

\`\`\`rust
sum!()          // 0
sum!(1, 2, 3)   // 6
\`\`\`

### \`str_vec![...]\`

引数をすべて \`String\` に変換した \`Vec<String>\` を作る（\`.to_string()\` を使う）。**末尾のカンマも許す** こと。

\`\`\`rust
str_vec!["a", "b",]   // ["a", "b"]（Vec<String>）
str_vec![1, 2]        // ["1", "2"]
\`\`\`

## 書き方

\`\`\`rust
( $( $x:expr ),* $(,)? ) => {{
    let mut v = Vec::new();
    $( v.push($x); )*
    v
}};
\`\`\`

\`$(,)?\` は「カンマが 0 個か 1 個」で、末尾カンマを許すための定番の書き方。`,
    hints: [
      "sum: `( $( $x:expr ),* ) => { 0 $( + $x )* };`",
      "str_vec: `$( v.push($x.to_string()); )*`",
      "空の `Vec::new()` は型が決まらないので `let mut v: Vec<String> = Vec::new();` と書く",
    ],
  },
  initialCode: `macro_rules! sum {
    ( $( $x:expr ),* ) => {
        todo!()
    };
}

macro_rules! str_vec {
    ( $( $x:expr ),* $(,)? ) => {
        todo!()
    };
}
`,
  solutionCode: `macro_rules! sum {
    ( $( $x:expr ),* ) => {
        0 $( + $x )*
    };
}

macro_rules! str_vec {
    ( $( $x:expr ),* $(,)? ) => {{
        let mut v: Vec<String> = Vec::new();
        $( v.push($x.to_string()); )*
        v
    }};
}
`,
});
