import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-chrome-get-text",
  stage: "fill",
  scenario: "chrome",
  copy: {
    title: "要素のテキストを集める",
    prompt: `## やること

Chrome 拡張のコンテンツスクリプトで、**クラス \`.item\` を持つ全要素のテキスト**を配列に集めるコードを書こう。

ページには次のような HTML が存在するとする:
\`\`\`html
<ul>
  <li class="item">りんご</li>
  <li class="item">バナナ</li>
  <li class="item">みかん</li>
</ul>
\`\`\`

## 使い方

- \`document.querySelectorAll(".item")\` → クラス \`.item\` の全要素（NodeList）
- \`el.textContent\` → 要素内のテキスト文字列
- \`texts\` → モックで用意済みの空配列（ここに追加していく）

## 進め方

\`querySelectorAll\` で全要素を取り、ループで各要素の \`textContent\` を \`texts\` に追加していく。

## document はモックです

採点環境にはブラウザがないため、\`document\` と \`texts\` はモックとして提供されます。`,
    hints: [
      '`document.querySelectorAll(".item")` でクラス名が `item` の全要素が取れる',
      "`items.forEach((el) => ...)` で全要素にアクセスできる",
      "`texts.push(el.textContent)` でテキストを配列に追加できる",
    ],
  },
  initialCode: `// document と texts はモックで用意されています
// texts: string[] — 結果を入れる空配列（すでに用意済み）

const items = document.querySelectorAll(".item");
// ここを完成させよう: items をループして textContent を texts に追加

`,
  solutionCode: `const items = document.querySelectorAll(".item");
items.forEach((el) => texts.push(el.textContent));
`,
});
