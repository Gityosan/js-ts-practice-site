import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-string-replace",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "文字列を置換する",
    prompt: `## やること

標準入力から文章を 1 行読み込み、最初に見つかった \`cat\` を \`dog\` に置き換えて出力しよう。

入力例: \`I have a cat\`
期待する出力: \`I have a dog\`

## ヒント: パラメータ展開の置換 \`\${var/pattern/replacement}\`

\`\`\`bash
read s
echo "\${s/cat/dog}"
\`\`\`

- **\`\${var/pattern/replacement}\`**（スラッシュ 1 個）は**最初の 1 か所だけ**置換する
- 全部置換したいときはスラッシュを 2 個にした \`\${var//pattern/replacement}\` を使う（今回は使わない）`,
    hints: ["`read s` で読み込む", '`"${s/cat/dog}"` で最初の cat だけ dog に置換'],
  },
  initialCode: `read s
# ここに echo を書こう`,
  solutionCode: `read s
echo "\${s/cat/dog}"`,
});
