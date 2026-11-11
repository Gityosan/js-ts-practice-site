import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-test-custom-asserts",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "自分用のアサーション関数を作る",
    prompt: `## やること

テストでよく使う検査を、**失敗したら panic する補助関数** としてまとめよう。中では \`assert!\` / \`assert_eq!\` / \`assert_ne!\` を使う。

- \`assert_sorted(xs: &[i32])\` … 昇順（同じ値の並びは OK）でなければ panic。メッセージは \`"not sorted at index 2: 5 > 3"\`（\`xs[i] > xs[i + 1]\` となった最初の \`i\` と値）
- \`assert_same_elements(a: &[i32], b: &[i32])\` … 並び順を無視して同じ要素（個数も含めて）でなければ panic。並べ替えたコピー同士を \`assert_eq!\` で比べる
- \`assert_all_distinct(xs: &[i32])\` … 隣同士に限らず、どれか 2 つが同じ値なら panic（\`assert_ne!\` を使ってみよう）

\`\`\`rust
assert_sorted(&[1, 2, 2, 5]);            // 何も起きない
assert_sorted(&[1, 2, 5, 3]);            // panic: not sorted at index 2: 5 > 3
assert_same_elements(&[3, 1, 2], &[1, 2, 3]); // 何も起きない
assert_same_elements(&[1, 1, 2], &[1, 2, 2]); // panic
assert_all_distinct(&[4, 1, 4]);         // panic
\`\`\`

採点側は \`catch_unwind\` で「panic したかどうか」（\`is_ok()\` / \`is_err()\`）とメッセージを確かめる。`,
    hints: [
      '`for i in 0..xs.len().saturating_sub(1) { assert!(xs[i] <= xs[i + 1], "not sorted at index {}: {} > {}", i, xs[i], xs[i + 1]); }`',
      "`let mut x = a.to_vec(); x.sort();` を両方に行って `assert_eq!(x, y);`。",
      "`assert_all_distinct` は二重ループで `for j in (i + 1)..xs.len() { assert_ne!(xs[i], xs[j]); }`。",
    ],
  },
  initialCode: `fn assert_sorted(xs: &[i32]) {
    todo!()
}

fn assert_same_elements(a: &[i32], b: &[i32]) {
    todo!()
}

fn assert_all_distinct(xs: &[i32]) {
    todo!()
}
`,
  solutionCode: `fn assert_sorted(xs: &[i32]) {
    for i in 0..xs.len().saturating_sub(1) {
        assert!(xs[i] <= xs[i + 1], "not sorted at index {}: {} > {}", i, xs[i], xs[i + 1]);
    }
}

fn assert_same_elements(a: &[i32], b: &[i32]) {
    let mut x = a.to_vec();
    let mut y = b.to_vec();
    x.sort();
    y.sort();
    assert_eq!(x, y);
}

fn assert_all_distinct(xs: &[i32]) {
    for i in 0..xs.len() {
        for j in (i + 1)..xs.len() {
            assert_ne!(xs[i], xs[j]);
        }
    }
}
`,
});
