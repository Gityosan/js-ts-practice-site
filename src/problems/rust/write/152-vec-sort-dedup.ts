import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-vec-sort-retain",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "sort_by / sort_by_key / dedup / retain",
    prompt: `## やること

Vec の整理用メソッドを使って 4 つの関数を書こう。いずれも \`v\` を **その場で** 書き換える。

- \`unique_sorted(v: &mut Vec<i32>)\` … 昇順に並べて重複を取り除く（\`sort\` + \`dedup\`）
- \`remove_negatives(v: &mut Vec<i32>)\` … 負の数を取り除く（\`retain\`）。順序は保つ
- \`sort_desc(v: &mut Vec<i32>)\` … 降順に並べる（\`sort_by\` と \`b.cmp(a)\`）
- \`sort_words(v: &mut Vec<String>)\` … **短い順**、長さが同じなら **辞書順** に並べる（\`sort_by_key\` でタプルをキーにする、または \`sort_by\`）

さらに \`position_of(v: &[i32], x: i32) -> Option<usize>\` を \`v.iter().position(..)\` で、
\`has_all(v: &[i32], xs: &[i32]) -> bool\`（xs の全要素が v に含まれるか）を \`contains\` で書こう。

\`\`\`rust
let mut v = vec![3, 1, 3, 2, 1];
unique_sorted(&mut v);           // [1, 2, 3]
\`\`\``,
    hints: [
      "`v.sort(); v.dedup();`",
      "`v.retain(|&x| x >= 0);`",
      "`v.sort_by(|a, b| b.cmp(a));`",
      "`v.sort_by_key(|s| (s.len(), s.clone()));`",
      "`v.iter().position(|&y| y == x)`、`xs.iter().all(|x| v.contains(x))`",
    ],
  },
  initialCode: `fn unique_sorted(v: &mut Vec<i32>) {
    todo!()
}

fn remove_negatives(v: &mut Vec<i32>) {
    todo!()
}

fn sort_desc(v: &mut Vec<i32>) {
    todo!()
}

fn sort_words(v: &mut Vec<String>) {
    todo!()
}

fn position_of(v: &[i32], x: i32) -> Option<usize> {
    todo!()
}

fn has_all(v: &[i32], xs: &[i32]) -> bool {
    todo!()
}
`,
  solutionCode: `fn unique_sorted(v: &mut Vec<i32>) {
    v.sort();
    v.dedup();
}

fn remove_negatives(v: &mut Vec<i32>) {
    v.retain(|&x| x >= 0);
}

fn sort_desc(v: &mut Vec<i32>) {
    v.sort_by(|a, b| b.cmp(a));
}

fn sort_words(v: &mut Vec<String>) {
    v.sort_by_key(|s| (s.len(), s.clone()));
}

fn position_of(v: &[i32], x: i32) -> Option<usize> {
    v.iter().position(|&y| y == x)
}

fn has_all(v: &[i32], xs: &[i32]) -> bool {
    xs.iter().all(|x| v.contains(x))
}
`,
});
