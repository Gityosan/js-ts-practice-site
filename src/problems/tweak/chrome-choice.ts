import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "tweak-chrome-choice",
  stage: "tweak",
  scenario: "chrome",
  copy: {
    title: "ページ上の全ボタンを無効化しよう",
    prompt: `## やること

Chrome 拡張のコンテンツスクリプトで、**ページ上のボタンをすべて無効化**するコードを完成させよう。

空欄を選んで正しいコードにしよう。

## querySelector vs querySelectorAll

| メソッド | 返す数 | 使い道 |
|---|---|---|
| \`querySelector(sel)\` | 最初の**1件**だけ | 特定の1つの要素を取る |
| \`querySelectorAll(sel)\` | **全件**（NodeList）| 複数まとめて操作する |

## NodeList の forEach

\`querySelectorAll\` が返すのは配列ではなく **NodeList** という形。
\`Array\` の \`map\` や \`filter\` は使えないが、\`forEach\` は使える。

## disabled プロパティ

\`<button>\` 要素の \`disabled\` を \`true\` にすると、クリックできない状態になる。`,
    hints: [
      "全件取得したいので `querySelector`（1件）ではなく `querySelectorAll`（全件）を使う",
      "NodeList なので `map` は使えない — `forEach` でひとつずつ処理する",
      "`btn.disabled = true` でボタンをクリック不可にできる",
    ],
  },
  tweak: {
    kind: "choice",
    template: `const buttons = document.{{0}}("button");
buttons.forEach((btn) => { btn.{{1}} = true; });`,
    blanks: [
      { choices: ["querySelectorAll", "querySelector", "getElementById"], answer: "querySelectorAll" },
      { choices: ["disabled", "value", "hidden"], answer: "disabled" },
    ],
  },
  initialCode: `const buttons = document.querySelectorAll("button");
buttons.forEach((btn) => { btn.disabled = true; });`,
  solutionCode: `const buttons = document.querySelectorAll("button");
buttons.forEach((btn) => { btn.disabled = true; });`,
});
