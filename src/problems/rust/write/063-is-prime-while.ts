import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-is-prime-while",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "素数判定（while）",
    prompt: `## やること

\`n\` が素数なら \`true\`、そうでなければ \`false\` を返す関数 \`is_prime\` を書こう。

素数: 1 と自分自身以外に約数を持たない **2 以上** の整数（2, 3, 5, 7, 11, ...）。

\`\`\`rust
is_prime(7)    // true
is_prime(9)    // false
is_prime(1)    // false
\`\`\`

## 考え方

- 2 未満は素数ではない
- 2 から順に割っていき、割り切れたら素数ではない
- 調べるのは \`i * i <= n\` の間だけでよい（\`n = a × b\` なら a か b のどちらかは √n 以下だから）

\`\`\`rust
let mut i = 2;
while i * i <= n {
    // ...
    i += 1;
}
\`\`\`

\`while\` は条件が true の間繰り返す。途中で結果が分かったら \`return false;\` で抜けてよい。`,
    hints: [
      "最初に `if n < 2 { return false; }`",
      "ループ内で `if n % i == 0 { return false; }`、ループを抜けたら `true`",
    ],
  },
  initialCode: `fn is_prime(n: u32) -> bool {
    todo!()
}
`,
  solutionCode: `fn is_prime(n: u32) -> bool {
    if n < 2 {
        return false;
    }
    let mut i = 2;
    while i * i <= n {
        if n % i == 0 {
            return false;
        }
        i += 1;
    }
    true
}
`,
});
