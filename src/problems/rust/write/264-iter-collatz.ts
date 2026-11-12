import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-iter-collatz",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "有限の自作イテレータ: コラッツ数列",
    prompt: `## やること

**コラッツ数列** を返すイテレータ \`Collatz\` を作ろう。

- 偶数なら 2 で割る、奇数なら 3 倍して 1 を足す、を **1 になるまで** 繰り返す
- 最初の数も含め、**1 を返したら終わり**（次の next は None）

\`\`\`rust
Collatz::new(6).collect::<Vec<_>>()
// [6, 3, 10, 5, 16, 8, 4, 2, 1]
Collatz::new(1).collect::<Vec<_>>()   // [1]
\`\`\`

状態は \`Option<u64>\`（次に返す値。終わったら None）で持つと書きやすい。

さらに、Collatz を使って:

- \`steps(n: u64) -> usize\` … 1 に着くまでの手順の数（= 要素数 - 1）
- \`longest_start(limit: u64) -> u64\` … 1〜limit の中で、数列が一番長くなる開始値（同じ長さなら小さいほう）`,
    hints: [
      "next: `let cur = self.next_val?;` で None なら終わり。`self.next_val = if cur == 1 { None } else if cur % 2 == 0 { Some(cur / 2) } else { Some(cur * 3 + 1) };` `Some(cur)`",
      "steps は `Collatz::new(n).count() - 1`",
      "longest_start は `(1..=limit).max_by_key(|&n| (Collatz::new(n).count(), std::cmp::Reverse(n))).unwrap()` か for ループで",
    ],
  },
  initialCode: `struct Collatz {
    next_val: Option<u64>,
}

impl Collatz {
    fn new(start: u64) -> Collatz {
        todo!()
    }
}

impl Iterator for Collatz {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        todo!()
    }
}

fn steps(n: u64) -> usize {
    todo!()
}

fn longest_start(limit: u64) -> u64 {
    todo!()
}
`,
  solutionCode: `struct Collatz {
    next_val: Option<u64>,
}

impl Collatz {
    fn new(start: u64) -> Collatz {
        Collatz { next_val: Some(start) }
    }
}

impl Iterator for Collatz {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        let cur = self.next_val?;
        self.next_val = if cur == 1 {
            None
        } else if cur % 2 == 0 {
            Some(cur / 2)
        } else {
            Some(cur * 3 + 1)
        };
        Some(cur)
    }
}

fn steps(n: u64) -> usize {
    Collatz::new(n).count() - 1
}

fn longest_start(limit: u64) -> u64 {
    let mut best = 1;
    let mut best_len = 0;
    for n in 1..=limit {
        let len = Collatz::new(n).count();
        if len > best_len {
            best = n;
            best_len = len;
        }
    }
    best
}
`,
});
