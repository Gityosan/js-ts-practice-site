import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-unsafe-raw-pointer-split",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "生ポインタで split_at_mut を自作する",
    prompt: `## やること

標準の \`split_at_mut\` と同じ働きをする \`my_split_at_mut\` を、**生ポインタと unsafe** で実装しよう。さらに生ポインタで値を入れ替える \`raw_swap\` も書く。

### \`my_split_at_mut(s: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32])\`

- まず \`assert!(mid <= s.len());\` で前提を確かめる（範囲外なら panic）。これがあるので関数自体は安全な \`fn\` にできる
- \`let ptr = s.as_mut_ptr();\` で先頭の生ポインタを得る
- \`std::slice::from_raw_parts_mut(ptr, mid)\` と \`std::slice::from_raw_parts_mut(ptr.add(mid), len - mid)\` で 2 つのスライスを作る（どちらも unsafe な関数）

### \`raw_swap(a: *mut i32, b: *mut i32)\`

\`unsafe\` ブロックの中で、生ポインタの読み書き（\`*a\`, \`*b\`）を使って 2 つの値を入れ替える。

\`\`\`rust
let mut x = 1;
let mut y = 2;
raw_swap(&raw mut x, &raw mut y); // x = 2, y = 1
\`\`\`

（本来、無効なポインタを受け取りうるこのような関数は \`unsafe fn\` にすべきだが、ここでは練習のため普通の \`fn\` にしている）`,
    hints: [
      "`let len = s.len(); let ptr = s.as_mut_ptr();`",
      "`unsafe { (std::slice::from_raw_parts_mut(ptr, mid), std::slice::from_raw_parts_mut(ptr.add(mid), len - mid)) }`",
      "swap: `unsafe { let t = *a; *a = *b; *b = t; }`",
    ],
  },
  initialCode: `fn my_split_at_mut(s: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    todo!()
}

fn raw_swap(a: *mut i32, b: *mut i32) {
    todo!()
}
`,
  solutionCode: `fn my_split_at_mut(s: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = s.len();
    assert!(mid <= len);
    let ptr = s.as_mut_ptr();
    unsafe {
        (
            std::slice::from_raw_parts_mut(ptr, mid),
            std::slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

fn raw_swap(a: *mut i32, b: *mut i32) {
    unsafe {
        let t = *a;
        *a = *b;
        *b = t;
    }
}
`,
});
