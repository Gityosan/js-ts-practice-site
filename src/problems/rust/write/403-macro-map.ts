import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-macro-hashmap-literal",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "map! マクロで HashMap を一発で作る",
    prompt: `## やること

\`キー => 値\` を並べて \`HashMap\` を作るマクロ \`map!\` を書こう。末尾カンマも許す。

\`\`\`rust
let m = map! {
    "apple" => 120,
    "banana" => 80,
};
// m は HashMap<&str, i32>
\`\`\`

空の \`map!{}\` は空の \`HashMap\` を作る（型は使う側で決まる）。

## パターンの書き方

\`=>\` はマクロのパターンの中にそのまま書ける（区切り記号として扱われる）。

\`\`\`rust
( $( $k:expr => $v:expr ),* $(,)? ) => {{ ... }};
\`\`\`

採点では HashMap の順序が不定なので、\`BTreeMap\` に変換したり \`get\` したりして確かめる。`,
    hints: [
      "`let mut m = std::collections::HashMap::new();`",
      "`$( m.insert($k, $v); )*`",
      "最後に `m` を返す。展開全体を `{{ ... }}` で 1 つのブロック式にする",
    ],
  },
  initialCode: `macro_rules! map {
    ( $( $k:expr => $v:expr ),* $(,)? ) => {
        todo!()
    };
}
`,
  solutionCode: `macro_rules! map {
    ( $( $k:expr => $v:expr ),* $(,)? ) => {{
        let mut m = std::collections::HashMap::new();
        $( m.insert($k, $v); )*
        m
    }};
}
`,
});
