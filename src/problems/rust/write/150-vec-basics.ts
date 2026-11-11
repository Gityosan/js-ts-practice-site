import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-vec-ops-basics",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Vec の基本操作（push / pop / insert / remove / get）",
    prompt: `## やること

Vec の基本操作を使って 4 つの関数を書こう。

- \`build(n: u32) -> Vec<u32>\` … \`1, 2, ..., n\` の **2 乗** を順に入れた Vec。\`Vec::with_capacity(n as usize)\` で作って \`push\`
- \`rotate_left_once(v: &mut Vec<i32>)\` … 先頭の要素を取り除いて末尾に付ける。空なら何もしない（\`remove(0)\` と \`push\`）
- \`insert_sorted(v: &mut Vec<i32>, x: i32)\` … 昇順に並んだ v に、順序を保つ位置へ x を \`insert\`
- \`nth_or(v: &[i32], i: usize, default: i32) -> i32\` … i 番目の要素。範囲外なら default（\`get\` を使って panic しないように）

\`\`\`rust
build(4);                    // [1, 4, 9, 16]
let mut v = vec![1, 2, 3];
rotate_left_once(&mut v);    // [2, 3, 1]
insert_sorted(&mut v2, 5);   // [1, 3, 7] → [1, 3, 5, 7]
nth_or(&[10, 20], 5, -1);    // -1
\`\`\``,
    hints: [
      "`for i in 1..=n { v.push(i * i); }`",
      "rotate: `if !v.is_empty() { let x = v.remove(0); v.push(x); }`",
      "insert_sorted: 「x 以上の最初の位置」を探す。なければ末尾（`v.len()`）",
      "nth_or: `*v.get(i).unwrap_or(&default)` か `match v.get(i) { Some(&x) => x, None => default }`",
    ],
  },
  initialCode: `fn build(n: u32) -> Vec<u32> {
    todo!()
}

fn rotate_left_once(v: &mut Vec<i32>) {
    todo!()
}

fn insert_sorted(v: &mut Vec<i32>, x: i32) {
    todo!()
}

fn nth_or(v: &[i32], i: usize, default: i32) -> i32 {
    todo!()
}
`,
  solutionCode: `fn build(n: u32) -> Vec<u32> {
    let mut v = Vec::with_capacity(n as usize);
    for i in 1..=n {
        v.push(i * i);
    }
    v
}

fn rotate_left_once(v: &mut Vec<i32>) {
    if !v.is_empty() {
        let x = v.remove(0);
        v.push(x);
    }
}

fn insert_sorted(v: &mut Vec<i32>, x: i32) {
    let mut pos = v.len();
    for (i, &y) in v.iter().enumerate() {
        if y >= x {
            pos = i;
            break;
        }
    }
    v.insert(pos, x);
}

fn nth_or(v: &[i32], i: usize, default: i32) -> i32 {
    match v.get(i) {
        Some(&x) => x,
        None => default,
    }
}
`,
});
