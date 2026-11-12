import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-vecdeque-queue",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "VecDeque でキュー処理",
    prompt: `## やること

VecDeque を使った 2 つの処理を書こう。

### 1. プリンタの待ち行列

\`process(jobs: &[(&str, u32)], capacity: u32) -> Vec<String>\`

各ジョブは \`(名前, ページ数)\`。プリンタは 1 回に最大 \`capacity\` ページ印刷できる。

- キューの先頭のジョブを取り出し（\`pop_front\`）、残りページが capacity 以下なら印刷完了として名前を結果に追加
- capacity より多ければ capacity ページだけ印刷し、**残りページを持ってキューの末尾に戻す**（\`push_back\`）
- キューが空になるまで繰り返す（\`while let Some(..) = q.pop_front()\`）

\`\`\`rust
process(&[("a", 5), ("b", 2), ("c", 3)], 3);
// a: 5→残り 2 で末尾へ / b 完了 / c 完了 / a 完了
// ["b", "c", "a"]
\`\`\`

### 2. 直近 k 件の移動合計

\`moving_sum(v: &[i32], k: usize) -> Vec<i32>\` … 各位置で「直近 k 個（それ以下ならあるだけ）の合計」を並べる。
VecDeque に \`push_back\` し、k 個を超えたら \`pop_front\` で古いものを捨てる。

\`\`\`rust
moving_sum(&[1, 2, 3, 4], 2);   // [1, 3, 5, 7]
\`\`\``,
    hints: [
      "`let mut q: VecDeque<(&str, u32)> = jobs.iter().copied().collect();`",
      "`while let Some((name, pages)) = q.pop_front() { if pages <= capacity { done.push(name.to_string()); } else { q.push_back((name, pages - capacity)); } }`",
      "moving_sum: 合計を変数で持ち、push で足して pop で引くと速い",
    ],
  },
  initialCode: `use std::collections::VecDeque;

fn process(jobs: &[(&str, u32)], capacity: u32) -> Vec<String> {
    todo!()
}

fn moving_sum(v: &[i32], k: usize) -> Vec<i32> {
    todo!()
}
`,
  solutionCode: `use std::collections::VecDeque;

fn process(jobs: &[(&str, u32)], capacity: u32) -> Vec<String> {
    let mut q: VecDeque<(&str, u32)> = jobs.iter().copied().collect();
    let mut done = Vec::new();
    while let Some((name, pages)) = q.pop_front() {
        if pages <= capacity {
            done.push(name.to_string());
        } else {
            q.push_back((name, pages - capacity));
        }
    }
    done
}

fn moving_sum(v: &[i32], k: usize) -> Vec<i32> {
    let mut window: VecDeque<i32> = VecDeque::new();
    let mut sum = 0;
    let mut out = Vec::new();
    for &x in v {
        window.push_back(x);
        sum += x;
        if window.len() > k {
            if let Some(old) = window.pop_front() {
                sum -= old;
            }
        }
        out.push(sum);
    }
    out
}
`,
});
