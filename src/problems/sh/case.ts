import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-case",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "シェルで場合分けする（case）",
    prompt: `## やること

\`apple\` \`banana\` \`carrot\` の3つを順に見て、
**apple と banana は \`fruit\`、それ以外は \`other\`** と出力しよう。

期待する出力:

\`\`\`
apple: fruit
banana: fruit
carrot: other
\`\`\`

## ヒント: case 文

\`\`\`bash
case "$f" in
  apple|banana) echo "$f: fruit" ;;
  *)            echo "$f: other" ;;
esac
\`\`\`

- \`パターン)\` … \`;;\` が1つの枝。\`|\` で複数パターン、\`*)\` は「その他」`,
    hints: [
      "`for f in apple banana carrot; do ... done` でまわす",
      '`case "$f" in apple|banana) ... ;; *) ... ;; esac`',
      '各枝は `echo "$f: fruit"` のように出力する',
    ],
  },
  initialCode: `for f in apple banana carrot; do
  case "$f" in
    # ここに枝を書く
  esac
done`,
  solutionCode: `for f in apple banana carrot; do
  case "$f" in
    apple|banana) echo "$f: fruit" ;;
    *) echo "$f: other" ;;
  esac
done`,
});
