import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-unique-tags",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で重複を消して並べる（unique）",
    prompt: `## やること

入力のタグから、**重複を消して昇順**に 1 行ずつ出力しよう。

入力例:

\`\`\`json
{ "tags": ["b", "a", "c", "a", "b"] }
\`\`\`

期待する出力:

\`\`\`
a
b
c
\`\`\`

## ヒント: unique

- **\`unique\`** は配列を「重複除去＋昇順ソート」してくれる
- \`.tags | unique\` で配列になる → \`| .[]\` で 1 要素ずつ展開
- 採点は \`-r\` 付き`,
    hints: [
      "`.tags | unique` で重複が消えてソートされる（結果は配列）",
      "`| .[]` を足すと 1 行ずつになる",
      "答えは `.tags | unique | .[]`",
    ],
  },
  initialCode: `.tags`,
  solutionCode: `.tags | unique | .[]`,
});
