import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-const-seconds",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "const で定数を定義して秒数を計算する",
    prompt: `## やること

次の 2 つの **定数** と 1 つの関数を完成させよう。

- \`SECONDS_PER_MINUTE\`（1 分の秒数 = 60）
- \`SECONDS_PER_HOUR\`（1 時間の秒数。\`SECONDS_PER_MINUTE\` を使って書くとよい）
- \`to_seconds(h, m, s)\` … h 時間 m 分 s 秒 を秒に直す

\`\`\`rust
to_seconds(1, 0, 0)   // 3600
to_seconds(0, 2, 5)   // 125
\`\`\`

初期コードでは定数が仮に \`0\` になっているので、正しい値に書き換えること。

## const の書き方

\`\`\`rust
const MAX_POINTS: u32 = 100_000;
\`\`\`

- **型注釈が必須**（\`: u32\`）
- 名前は大文字のスネークケース
- 値はコンパイル時に計算できる式（\`60 * 60\` や他の \`const\` を使った式は OK）`,
    hints: [
      "`const SECONDS_PER_HOUR: u32 = 60 * SECONDS_PER_MINUTE;`",
      "`h * SECONDS_PER_HOUR + m * SECONDS_PER_MINUTE + s`",
    ],
  },
  initialCode: `const SECONDS_PER_MINUTE: u32 = 0; // 正しい値にしよう
const SECONDS_PER_HOUR: u32 = 0; // 正しい値にしよう

fn to_seconds(h: u32, m: u32, s: u32) -> u32 {
    todo!()
}
`,
  solutionCode: `const SECONDS_PER_MINUTE: u32 = 60;
const SECONDS_PER_HOUR: u32 = 60 * SECONDS_PER_MINUTE;

fn to_seconds(h: u32, m: u32, s: u32) -> u32 {
    h * SECONDS_PER_HOUR + m * SECONDS_PER_MINUTE + s
}
`,
});
