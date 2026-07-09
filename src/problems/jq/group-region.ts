import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-group-region",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で集計する（group_by）",
    prompt: `## やること

売上を **地域ごとに合計**し、\`{ region, total }\` の配列にして出力しよう。

入力例:

\`\`\`json
{ "sales": [
  { "region": "east", "amt": 10 },
  { "region": "west", "amt": 5 },
  { "region": "east", "amt": 3 }
] }
\`\`\`

期待する出力（\`-c\`）:

\`\`\`
[{"region":"east","total":13},{"region":"west","total":5}]
\`\`\`

## ヒント: group_by

- **\`group_by(.region)\`** は同じ region ごとの小配列に分ける（\`[[east,east],[west]]\` のイメージ）
- その各グループを \`map(...)\` で \`{region, total}\` にする
- グループの region は \`.[0].region\`、合計は \`(map(.amt) | add)\``,
    hints: [
      "`.sales | group_by(.region)` で地域ごとの配列の配列になる",
      "`| map({region: .[0].region, total: (map(.amt) | add)})` で各グループを集計",
      "答えは `.sales | group_by(.region) | map({region: .[0].region, total: (map(.amt) | add)})`",
    ],
  },
  initialCode: `.sales | group_by(.region)`,
  solutionCode: `.sales | group_by(.region) | map({region: .[0].region, total: (map(.amt) | add)})`,
});
