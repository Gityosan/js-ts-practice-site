import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-string-build",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "String を組み立てる（push_str / push / format!）",
    prompt: `## やること

### full_name(first, last)

名と姓から \`"姓 名"\` の形の \`String\` を作る（\`format!\` を使ってみよう）。

\`\`\`rust
full_name("Taro", "Yamada")   // "Yamada Taro"
\`\`\`

### build_list(items)

文字列スライスの配列を受け取り、各要素の前に \`"- "\`、後ろに改行 \`'\\n'\` を付けてつなげた \`String\` を返す。
**\`String::new()\` と \`push_str\` / \`push\`** を使ってみよう。

\`\`\`rust
build_list(&["apple", "banana"])   // "- apple\\n- banana\\n"
build_list(&[])                    // ""
\`\`\`

## ポイント

- \`format!("{} {}", a, b)\` は \`println!\` と同じ書式で \`String\` を作る
- \`let mut s = String::new();\` で空の String を作り、\`s.push_str("...")\` で &str を、\`s.push('x')\` で char を追加
- \`&[&str]\` は「&str のスライス」。\`for item in items { ... }\` で回すと \`item\` は \`&&str\` だが、\`push_str(item)\` にそのまま渡せる`,
    hints: [
      '`format!("{last} {first}")`',
      "`let mut s = String::new(); for item in items { s.push_str(\"- \"); s.push_str(item); s.push('\\n'); } s`",
    ],
  },
  initialCode: `fn full_name(first: &str, last: &str) -> String {
    todo!()
}

fn build_list(items: &[&str]) -> String {
    todo!()
}
`,
  solutionCode: `fn full_name(first: &str, last: &str) -> String {
    format!("{last} {first}")
}

fn build_list(items: &[&str]) -> String {
    let mut s = String::new();
    for item in items {
        s.push_str("- ");
        s.push_str(item);
        s.push('\\n');
    }
    s
}
`,
});
