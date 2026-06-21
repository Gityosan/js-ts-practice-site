import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-chrome-fill-form",
  stage: "fill",
  scenario: "chrome",
  copy: {
    title: "フォームに値を自動入力しよう",
    prompt: `## やること

Chrome 拡張のコンテンツスクリプトで、**ログインフォームに値を自動入力**する関数を完成させよう。

ページには次の HTML が存在するとする:

\`\`\`html
<input id="username" type="text" />
<input id="password" type="password" />
\`\`\`

\`document.querySelector\` でセレクタ（\`"#username"\` など）を渡すと、その要素オブジェクトが取れる。
取れた要素の \`.value\` プロパティに文字列を代入すると入力が完了する。

## document はモックです

採点環境にはブラウザがないため、\`document\` はモック（偽物）として提供されます。
挙動は本物と同じように動くので、気にせず書いてみよう。`,
    hints: [
      "`document.querySelector(\"#username\")` で username 要素が取れる",
      "取得した要素の `.value = username` で値をセットできる",
      "password も同じパターン — セレクタを `\"#password\"` にするだけ",
    ],
  },
  initialCode: `// document はモックで用意されています（本物と同じように使えます）
function fillForm(username: string, password: string): void {
  const usernameEl = document.querySelector("#username") as HTMLInputElement;
  // ここを埋めよう: usernameEl の value を username にセット


  const passwordEl = document.querySelector("#password") as HTMLInputElement;
  // ここを埋めよう: passwordEl の value を password にセット

}

fillForm("tanaka", "hunter2");
`,
  solutionCode: `function fillForm(username: string, password: string): void {
  const usernameEl = document.querySelector("#username") as HTMLInputElement;
  usernameEl.value = username;
  const passwordEl = document.querySelector("#password") as HTMLInputElement;
  passwordEl.value = password;
}

fillForm("tanaka", "hunter2");
`,
});
