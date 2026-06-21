import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "learn-variables",
  stage: "learn",
  scenario: "basic",
  copy: {
    title: "変数の種類（const / let / var）",
    prompt: `## 3つの宣言

| キーワード | 再代入 | 使う？ |
|---|---|---|
| \`const\` | できない | **基本これ** |
| \`let\` | できる | 後で変えるときだけ |
| \`var\` | できる | 古い書き方・避ける |

\`\`\`ts
const name = "田中";  // 変えない値
let count = 0;        // 後で count = 1 のように変える
count = count + 1;    // OK

const x = 5;
x = 10;               // ✗ エラー（const は再代入できない）
\`\`\`

## 方針

**まず \`const\` で書き、再代入が必要なときだけ \`let\`**。\`var\` は使わない。`,
    hints: [
      "再代入する予定がなければ const。",
      "const に再代入しようとすると実行前にエラーになる。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "後から値を変えたい変数に使うのは？",
        choices: ["let", "const", "var"],
        answer: "let",
        explain: "再代入するなら `let`。`const` は再代入できない。",
      },
      {
        prompt: "特に理由がないとき、まず使うべきなのは？",
        choices: ["const", "let", "var"],
        answer: "const",
        explain: "まず `const`。変える必要が出たときだけ `let` にする。",
      },
      {
        prompt: "`const x = 5;` の後に `x = 10;` とするとどうなる？",
        snippet: `const x = 5;
x = 10;`,
        choices: ["エラーになる", "10 に変わる", "無視される"],
        answer: "エラーになる",
        explain: "`const` は再代入できないので、代入しようとするとエラーになる。",
      },
    ],
  },
});
