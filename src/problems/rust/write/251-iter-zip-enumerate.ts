import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-iter-zip-enumerate",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "zip と enumerate",
    prompt: `## やること

- （1）\`dot(a: &[i32], b: &[i32]) -> i32\` … 内積（対応する要素の積の合計）。長さが違えば短いほうに合わせる
- （2）\`indices_of(v: &[i32], target: i32) -> Vec<usize>\` … target と等しい要素の **位置** の一覧
- （3）\`numbered(items: &[&str]) -> Vec<String>\` … \`"1. apple"\` のように **1 から** 番号を付ける

\`\`\`rust
dot(&[1, 2, 3], &[4, 5, 6])          // 32
indices_of(&[7, 1, 7, 7, 2], 7)      // [0, 2, 3]
numbered(&["apple", "banana"])       // ["1. apple", "2. banana"]
\`\`\`

- \`a.iter().zip(b.iter())\` は \`(&a[i], &b[i])\` の組を順に返す（短いほうで終わる）
- \`v.iter().enumerate()\` は \`(番号, &要素)\` を返す（番号は 0 から）`,
    hints: [
      "`a.iter().zip(b.iter()).map(|(x, y)| x * y).sum()`",
      "`v.iter().enumerate().filter(|(_, &x)| x == target).map(|(i, _)| i).collect()`",
      '`items.iter().enumerate().map(|(i, s)| format!("{}. {}", i + 1, s)).collect()`',
    ],
  },
  initialCode: `fn dot(a: &[i32], b: &[i32]) -> i32 {
    todo!()
}

fn indices_of(v: &[i32], target: i32) -> Vec<usize> {
    todo!()
}

fn numbered(items: &[&str]) -> Vec<String> {
    todo!()
}
`,
  solutionCode: `fn dot(a: &[i32], b: &[i32]) -> i32 {
    a.iter().zip(b.iter()).map(|(x, y)| x * y).sum()
}

fn indices_of(v: &[i32], target: i32) -> Vec<usize> {
    v.iter()
        .enumerate()
        .filter(|(_, x)| **x == target)
        .map(|(i, _)| i)
        .collect()
}

fn numbered(items: &[&str]) -> Vec<String> {
    items
        .iter()
        .enumerate()
        .map(|(i, s)| format!("{}. {}", i + 1, s))
        .collect()
}
`,
});
