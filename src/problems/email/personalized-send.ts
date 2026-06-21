import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-email-personalized",
  stage: "fill",
  scenario: "email",
  copy: {
    title: "一人ずつ内容を変えて送ろう",
    prompt: `## やること

\`members\` 配列の各メンバーに、**名前を差し込んだ本文**でメールを送るコードを書こう。

モックで用意されている変数:
- \`members: { name: string; email: string }[]\` — 送信先のリスト
- \`sendEmail(to, subject, body)\` — メール送信関数（モック）

## 進め方

\`members\` をループで回し、各メンバーの \`email\` 宛に \`sendEmail\` を呼ぶ。
本文は名前を差し込みたいので、テンプレートリテラルが便利。

## ポイント

- テンプレートリテラル（バッククォートで囲んだ文字列）を使うと変数を埋め込める
- 件名は \`"お知らせ"\` に統一すること
- 本文は「\${member.name}様、お知らせです。」の形にすること（採点でチェックされる）`,
    hints: [
      "`for (const member of members)` で配列の各要素を順に取り出せる",
      "テンプレートリテラル: バッククォートで囲んで `${member.name}` と書くと名前が埋め込まれる",
      "`sendEmail(member.email, \"お知らせ\", ...)` の引数の順番（宛先・件名・本文）に注意",
    ],
  },
  initialCode: `// members と sendEmail はモック済みで使えます
// members: { name: string; email: string }[]
// sendEmail(to, subject, body)

for (const member of members) {
  // ここを完成させよう: member の email に、名前を差し込んだ本文で送信

}
`,
  solutionCode: `for (const member of members) {
  sendEmail(member.email, "お知らせ", \`\${member.name}様、お知らせです。\`);
}
`,
});
