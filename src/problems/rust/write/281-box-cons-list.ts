import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-box-cons-list",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "コンスリストを作って数える",
    prompt: `## やること

再帰的な enum \`List\`（コンスリスト）が定義されている。次の 3 つの関数を書こう。

\`\`\`rust
#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}
\`\`\`

- \`from_slice(xs: &[i32]) -> List\` … スライスの要素を先頭から順に並べたリストを作る。\`[1, 2]\` → \`Cons(1, Cons(2, Nil))\`
- \`len(list: &List) -> usize\` … 要素数
- \`sum(list: &List) -> i32\` … 合計

\`\`\`rust
from_slice(&[1, 2, 3])        // Cons(1, Cons(2, Cons(3, Nil)))
len(&from_slice(&[1, 2, 3]))  // 3
sum(&from_slice(&[]))         // 0
\`\`\`

## ヒント

- \`match list { Cons(v, rest) => ..., Nil => ... }\` で場合分けして再帰する
- \`from_slice\` はスライスパターン \`[first, rest @ ..]\` を使うか、末尾から組み立てるとよい`,
    hints: [
      "`len` は `Cons(_, rest) => 1 + len(rest)`、`Nil => 0`。",
      "`from_slice` は `match xs { [] => Nil, [first, rest @ ..] => Cons(*first, Box::new(from_slice(rest))) }`。",
      "ループで書くなら、末尾の要素から `list = Cons(x, Box::new(list))` と積み上げる（`.iter().rev()`）。",
    ],
  },
  initialCode: `#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn from_slice(xs: &[i32]) -> List {
    todo!()
}

fn len(list: &List) -> usize {
    todo!()
}

fn sum(list: &List) -> i32 {
    todo!()
}
`,
  solutionCode: `#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn from_slice(xs: &[i32]) -> List {
    match xs {
        [] => Nil,
        [first, rest @ ..] => Cons(*first, Box::new(from_slice(rest))),
    }
}

fn len(list: &List) -> usize {
    match list {
        Cons(_, rest) => 1 + len(rest),
        Nil => 0,
    }
}

fn sum(list: &List) -> i32 {
    match list {
        Cons(v, rest) => v + sum(rest),
        Nil => 0,
    }
}
`,
});
