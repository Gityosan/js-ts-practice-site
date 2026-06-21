import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-email-weekly",
  stage: "write",
  scenario: "email",
  copy: {
    title: "メールを送る①",
    prompt: `## やること

宛先リストの**全員に** \`sendEmail\` でメールを送るコードを書こう。

モックで用意されている変数:
- \`recipients: string[]\` — 送信先メールアドレスの配列
- \`report: string\` — メール本文
- \`sendEmail(to, subject, body)\` — メール送信関数（モック）

\`recipients\` をループで 1 件ずつ取り出し、それぞれに \`sendEmail\` を呼ぶ。

## ポイント

件名は必ず \`"週次レポート"\` にすること（採点でチェックされる）。
\`recipients\` が何人であっても全員に送ること。`,
    hints: [
      "`for (const to of recipients) { ... }` で配列の各要素を順に取り出せる",
      '件名は `"週次レポート"` と固定文字列で渡す',
      "`sendEmail(to, '週次レポート', report)` の順番に注意（to, subject, body）",
    ],
  },
  initialCode: `// 以下の変数が使えます（モック済み）:
// recipients: string[]  — 送信先リスト
// report: string        — メール本文
// sendEmail(to, subject, body) — 送信関数

// ここに書こう

`,
  solutionCode: `for (const to of recipients) {
  sendEmail(to, "週次レポート", report);
}
`,
});
