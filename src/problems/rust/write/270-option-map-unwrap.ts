import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-option-map-unwrap",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Option の map / unwrap_or / unwrap_or_default",
    prompt: `## やること

\`match\` を使わず、**コンビネータ** だけで書こう。

| 関数 | やること | 例 |
|---|---|---|
| \`name_length(name: Option<&str>) -> usize\` | 名前の文字数。None なら 0 | \`Some("Ann")\` → \`3\` |
| \`upper_or_empty(s: Option<String>) -> String\` | 大文字にする。None なら空文字列 | \`Some("hi")\` → \`"HI"\` |
| \`first_char_upper(s: &str) -> Option<char>\` | 先頭の文字を大文字にして返す。空なら None | \`"rust"\` → \`Some('R')\` |
| \`double_or_else(x: Option<i32>, fallback: i32) -> i32\` | 2 倍。None なら fallback の 10 倍（\`unwrap_or_else\` で） | \`None, 3\` → \`30\` |

- \`map(f)\` … Some の中身を f で変換（None は None のまま）
- \`unwrap_or(v)\` / \`unwrap_or_default()\` / \`unwrap_or_else(|| ...)\` … None のときの値
- \`s.chars().next()\` は \`Option<char>\` を返す。\`c.to_ascii_uppercase()\` で大文字に`,
    hints: [
      "`name.map(|s| s.chars().count()).unwrap_or(0)`",
      "`s.map(|t| t.to_uppercase()).unwrap_or_default()`",
      "`s.chars().next().map(|c| c.to_ascii_uppercase())`、`x.map(|v| v * 2).unwrap_or_else(|| fallback * 10)`",
    ],
  },
  initialCode: `fn name_length(name: Option<&str>) -> usize {
    todo!()
}

fn upper_or_empty(s: Option<String>) -> String {
    todo!()
}

fn first_char_upper(s: &str) -> Option<char> {
    todo!()
}

fn double_or_else(x: Option<i32>, fallback: i32) -> i32 {
    todo!()
}
`,
  solutionCode: `fn name_length(name: Option<&str>) -> usize {
    name.map(|s| s.chars().count()).unwrap_or(0)
}

fn upper_or_empty(s: Option<String>) -> String {
    s.map(|t| t.to_uppercase()).unwrap_or_default()
}

fn first_char_upper(s: &str) -> Option<char> {
    s.chars().next().map(|c| c.to_ascii_uppercase())
}

fn double_or_else(x: Option<i32>, fallback: i32) -> i32 {
    x.map(|v| v * 2).unwrap_or_else(|| fallback * 10)
}
`,
});
