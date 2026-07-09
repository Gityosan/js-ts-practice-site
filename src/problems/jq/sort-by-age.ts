import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-sort-by-age",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で並べ替える（sort_by）",
    prompt: `## やること

ユーザーを **年齢の若い順** に並べ替えて、名前を 1 行ずつ出力しよう。

入力例:

\`\`\`json
{ "users": [
  { "name": "Aki", "age": 30 },
  { "name": "Bo",  "age": 20 },
  { "name": "Zoe", "age": 25 }
] }
\`\`\`

期待する出力:

\`\`\`
Bo
Zoe
Aki
\`\`\`

## ヒント: sort_by

- **\`sort_by(.age)\`** は指定キーで昇順ソートする（結果は配列）
- \`.users | sort_by(.age)\` → \`| .[].name\` で名前を展開`,
    hints: [
      "`.users | sort_by(.age)` で若い順の配列になる",
      "`| .[].name` で名前を1行ずつ",
      "答えは `.users | sort_by(.age) | .[].name`",
    ],
  },
  initialCode: `.users | sort_by(.age)`,
  solutionCode: `.users | sort_by(.age) | .[].name`,
});
