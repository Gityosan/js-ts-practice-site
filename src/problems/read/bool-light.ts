import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "read-bool-light",
  stage: "read",
  scenario: "data",
  copy: {
    title: "true / false でランプを切り替えよう",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、緑のランプが点灯する。

次に \`true\` を \`false\` に変えて実行すると、赤のランプに切り替わる。

## コードを読んでみよう

\`\`\`ts
function solve(): boolean {
  return true; // true か false
}
\`\`\`

- \`function solve(): boolean\` — **真偽値（boolean）** を返す関数
- \`true\` — 「真」「オン」「はい」
- \`false\` — 「偽」「オフ」「いいえ」

## boolean とは？

**boolean**（ブーリアン）は \`true\` か \`false\` の 2 値しか持てない型。
条件分岐（if 文）などで中心的な役割を担う。

\`\`\`ts
if (isLoggedIn) {
  // ログイン済みの処理
}
\`\`\`

\`isLoggedIn\` のような変数は boolean 型が多い。

**\`true\` と \`false\` を交互に試してみよう。**`,
    hints: [
      "`true` を `false` に、または `false` を `true` に変えるだけ",
      "boolean は `true` と `false` の 2 値だけ — スペルに注意（小文字）",
      "プログラムの「スイッチ」として使われる型",
    ],
  },
  initialCode: `function solve(): boolean {
  return true; // ← true か false に変えてみよう
}`,
  solutionCode: `function solve(): boolean {
  return true;
}`,
});
