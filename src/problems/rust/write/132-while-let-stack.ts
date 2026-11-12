import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-while-let-brackets",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "while let とスタックで括弧の対応を調べる",
    prompt: `## やること

括弧 \`()\`, \`[]\`, \`{}\` の対応が正しいかを調べる \`balanced(s: &str) -> bool\` と、
スタックを空になるまで取り出す \`drain_stack(stack: Vec<i32>) -> Vec<i32>\` を書こう。

- \`balanced\`: 開き括弧は Vec に push、閉じ括弧が来たら pop して対応する開き括弧か確かめる。最後にスタックが空なら true。括弧以外の文字は無視
- \`drain_stack\`: \`while let Some(x) = stack.pop()\` で取り出した順に並べた Vec を返す（つまり逆順になる）

\`\`\`rust
balanced("{[()]}");   // true
balanced("([)]");     // false
balanced("((");       // false
drain_stack(vec![1, 2, 3]);  // [3, 2, 1]
\`\`\`

閉じ括弧のときの判定は match が便利:

\`\`\`rust
match (stack.pop(), c) {
    (Some('('), ')') | (Some('['), ']') | (Some('{'), '}') => {}
    _ => return false,
}
\`\`\``,
    hints: [
      "`for c in s.chars() { match c { '(' | '[' | '{' => stack.push(c), ')' | ']' | '}' => ..., _ => {} } }`",
      "pop した結果と閉じ括弧をタプルにして match すると書きやすい",
      "最後は `stack.is_empty()`",
      "drain_stack: 引数を `mut stack` にすると pop できる",
    ],
  },
  initialCode: `fn balanced(s: &str) -> bool {
    todo!()
}

fn drain_stack(stack: Vec<i32>) -> Vec<i32> {
    todo!()
}
`,
  solutionCode: `fn balanced(s: &str) -> bool {
    let mut stack: Vec<char> = Vec::new();
    for c in s.chars() {
        match c {
            '(' | '[' | '{' => stack.push(c),
            ')' | ']' | '}' => match (stack.pop(), c) {
                (Some('('), ')') | (Some('['), ']') | (Some('{'), '}') => {}
                _ => return false,
            },
            _ => {}
        }
    }
    stack.is_empty()
}

fn drain_stack(mut stack: Vec<i32>) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(x) = stack.pop() {
        out.push(x);
    }
    out
}
`,
});
