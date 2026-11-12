import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-option-zip-filter-or",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "zip / filter / or / map_or / as_deref",
    prompt: `## やること

Option のコンビネータをいろいろ使ってみよう。全部 1 行で書ける。

| 関数 | やること | 例 |
|---|---|---|
| \`add_opt(a: Option<i32>, b: Option<i32>) -> Option<i32>\` | 両方 Some なら和（\`zip\` + \`map\`） | \`Some(2), Some(3)\` → \`Some(5)\` |
| \`even_only(x: Option<i32>) -> Option<i32>\` | 偶数のときだけ残す（\`filter\`） | \`Some(3)\` → \`None\` |
| \`pick_name(nick: Option<&str>, real: Option<&str>) -> String\` | ニックネーム、なければ本名、どちらもなければ \`"anonymous"\`（\`or\` + \`unwrap_or\`） | \`None, Some("Ann")\` → \`"Ann"\` |
| \`is_adult(age: Option<u32>) -> bool\` | 20 以上なら true、None なら false（\`map_or\` か \`is_some_and\`） | \`Some(25)\` → \`true\` |
| \`title_len(title: &Option<String>) -> usize\` | タイトルの長さ（バイト）。None なら 0。**所有権を奪わずに**（\`as_deref\` か \`as_ref\`） | |`,
    hints: [
      "`a.zip(b).map(|(x, y)| x + y)`、`x.filter(|v| v % 2 == 0)`",
      '`nick.or(real).unwrap_or("anonymous").to_string()`、`age.map_or(false, |a| a >= 20)`',
      "`title.as_deref().map_or(0, |s| s.len())`",
    ],
  },
  initialCode: `fn add_opt(a: Option<i32>, b: Option<i32>) -> Option<i32> {
    todo!()
}

fn even_only(x: Option<i32>) -> Option<i32> {
    todo!()
}

fn pick_name(nick: Option<&str>, real: Option<&str>) -> String {
    todo!()
}

fn is_adult(age: Option<u32>) -> bool {
    todo!()
}

fn title_len(title: &Option<String>) -> usize {
    todo!()
}
`,
  solutionCode: `fn add_opt(a: Option<i32>, b: Option<i32>) -> Option<i32> {
    a.zip(b).map(|(x, y)| x + y)
}

fn even_only(x: Option<i32>) -> Option<i32> {
    x.filter(|v| v % 2 == 0)
}

fn pick_name(nick: Option<&str>, real: Option<&str>) -> String {
    nick.or(real).unwrap_or("anonymous").to_string()
}

fn is_adult(age: Option<u32>) -> bool {
    age.map_or(false, |a| a >= 20)
}

fn title_len(title: &Option<String>) -> usize {
    title.as_deref().map_or(0, |s| s.len())
}
`,
});
