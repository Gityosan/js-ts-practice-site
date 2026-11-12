import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-closure-return-box",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "クロージャを返す（impl Fn と Box<dyn Fn>）",
    prompt: `## やること

### 1. impl Fn で返す

\`make_adder(n: i32) -> impl Fn(i32) -> i32\` … 受け取った数に n を足すクロージャを返す。

\`\`\`rust
let add5 = make_adder(5);
add5(1)   // 6
\`\`\`

### 2. Box<dyn Fn> で返す

\`make_op(op: char) -> Box<dyn Fn(i32, i32) -> i32>\` … 演算子に応じたクロージャを返す。

| op | 動き |
|---|---|
| \`'+'\` | a + b |
| \`'-'\` | a - b |
| \`'*'\` | a * b |
| それ以外 | 常に 0 |

\`match\` の腕ごとに **違うクロージャ（違う型）** を返すので、\`impl Fn\` は使えない。\`Box::new(...)\` で包んで \`Box<dyn Fn>\` にする。

### 3. 関数を合成する

\`compose(f: impl Fn(i32) -> i32, g: impl Fn(i32) -> i32) -> impl Fn(i32) -> i32\` … \`g(f(x))\` を計算するクロージャを返す。

\`\`\`rust
let h = compose(make_adder(1), |x| x * 10);
h(2)   // 30   （(2 + 1) * 10）
\`\`\`

返すクロージャには \`move\` を付けて、キャプチャした値（n や f, g）を持たせよう。`,
    hints: [
      "make_adder は `move |x| x + n`",
      "make_op は `match op { '+' => Box::new(|a, b| a + b), ... _ => Box::new(|_, _| 0) }`",
      "compose は `move |x| g(f(x))`",
    ],
  },
  initialCode: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| todo!()
}

fn make_op(op: char) -> Box<dyn Fn(i32, i32) -> i32> {
    todo!()
}

fn compose(f: impl Fn(i32) -> i32, g: impl Fn(i32) -> i32) -> impl Fn(i32) -> i32 {
    move |x| todo!()
}
`,
  solutionCode: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

fn make_op(op: char) -> Box<dyn Fn(i32, i32) -> i32> {
    match op {
        '+' => Box::new(|a, b| a + b),
        '-' => Box::new(|a, b| a - b),
        '*' => Box::new(|a, b| a * b),
        _ => Box::new(|_, _| 0),
    }
}

fn compose(f: impl Fn(i32) -> i32, g: impl Fn(i32) -> i32) -> impl Fn(i32) -> i32 {
    move |x| g(f(x))
}
`,
});
