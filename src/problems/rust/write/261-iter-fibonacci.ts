import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-iter-fibonacci",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "無限イテレータ Fibonacci と take",
    prompt: `## やること

フィボナッチ数列 0, 1, 1, 2, 3, 5, 8, … を **終わりなく** 返すイテレータ \`Fibonacci\` を作ろう。

\`\`\`rust
Fibonacci::new().take(10).collect::<Vec<_>>()
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`

\`next\` は決して \`None\` を返さない（無限イテレータ）。使う側が \`take\` や \`take_while\` で必要な分だけ取り出す。

さらに、Fibonacci を使って 2 つの関数を書こう。

- （1）\`fib_under(limit: u64) -> Vec<u64>\` … limit **未満** のフィボナッチ数をすべて（\`take_while\`）
- （2）\`even_fib_sum(limit: u64) -> u64\` … limit 未満の **偶数** のフィボナッチ数の合計

\`\`\`rust
fib_under(20)       // [0, 1, 1, 2, 3, 5, 8, 13]
even_fib_sum(100)   // 44  （0 + 2 + 8 + 34）
\`\`\`

無限イテレータに直接 \`collect\` や \`sum\` を呼ぶと終わらないので注意。`,
    hints: [
      "フィールドは `a: u64, b: u64`。new は `Fibonacci { a: 0, b: 1 }`",
      "next: `let r = self.a; self.a = self.b; self.b += r; Some(r)`",
      "`Fibonacci::new().take_while(|&x| x < limit).filter(|x| x % 2 == 0).sum()`",
    ],
  },
  initialCode: `struct Fibonacci {
    a: u64,
    b: u64,
}

impl Fibonacci {
    fn new() -> Fibonacci {
        todo!()
    }
}

impl Iterator for Fibonacci {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        todo!()
    }
}

fn fib_under(limit: u64) -> Vec<u64> {
    todo!()
}

fn even_fib_sum(limit: u64) -> u64 {
    todo!()
}
`,
  solutionCode: `struct Fibonacci {
    a: u64,
    b: u64,
}

impl Fibonacci {
    fn new() -> Fibonacci {
        Fibonacci { a: 0, b: 1 }
    }
}

impl Iterator for Fibonacci {
    type Item = u64;

    fn next(&mut self) -> Option<u64> {
        let r = self.a;
        self.a = self.b;
        self.b += r;
        Some(r)
    }
}

fn fib_under(limit: u64) -> Vec<u64> {
    Fibonacci::new().take_while(|&x| x < limit).collect()
}

fn even_fib_sum(limit: u64) -> u64 {
    Fibonacci::new()
        .take_while(|&x| x < limit)
        .filter(|x| x % 2 == 0)
        .sum()
}
`,
});
