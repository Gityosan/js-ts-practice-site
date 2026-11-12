import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fizzbuzz-stdout",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "FizzBuzz を表示する（for と範囲）",
    prompt: `## やること

**\`fn main\` を含むプログラム全体** を書こう。1 から 15 までの数を 1 行ずつ表示する。ただし:

- 3 と 5 の両方で割り切れるときは \`FizzBuzz\`
- 3 で割り切れるときは \`Fizz\`
- 5 で割り切れるときは \`Buzz\`
- それ以外は数をそのまま

## 期待する出力

\`\`\`text
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
\`\`\`

## ポイント

- \`for i in 1..=15 { ... }\` で 1〜15（15 を含む）を回す
- 割り切れるかどうかは \`i % 3 == 0\`
- **15 の倍数の判定を最初に** しないと、\`Fizz\` が先に当たってしまう`,
    hints: [
      "`for i in 1..=15 {`",
      '`if i % 15 == 0 { println!("FizzBuzz"); } else if i % 3 == 0 { ... }`',
    ],
  },
  initialCode: `fn main() {
    // 1 から 15 まで FizzBuzz を表示しよう
}
`,
  solutionCode: `fn main() {
    for i in 1..=15 {
        if i % 15 == 0 {
            println!("FizzBuzz");
        } else if i % 3 == 0 {
            println!("Fizz");
        } else if i % 5 == 0 {
            println!("Buzz");
        } else {
            println!("{i}");
        }
    }
}
`,
});
