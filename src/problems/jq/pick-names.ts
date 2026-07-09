import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-pick-names",
  stage: "write",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq で名前だけ取り出す",
    prompt: `## やること

CLI ツール **jq** は、JSON を絞り込んで加工するためのフィルタ言語だよ。
入力の JSON から、**各ユーザーの名前だけ**を 1 行ずつ出力する jq フィルタを書こう。

入力（標準入力）はこんな形:

\`\`\`json
{ "users": [ { "name": "Aki", "age": 20 }, { "name": "Bo", "age": 30 } ] }
\`\`\`

期待する出力:

\`\`\`
Aki
Bo
\`\`\`

## jq フィルタの読み方

\`\`\`
.users[].name
^^^^^^ ^^ ^^^^^
配列を    各要素に  その
指す      展開      名前
\`\`\`

**\`.users\`** で users 配列を取り出し、**\`[]\`** で各要素に展開、**\`.name\`** で名前を取る。
採点は \`-r\`（raw 出力）付きで実行するので、\`"Aki"\` ではなく \`Aki\` と出る。`,
    hints: [
      "`.users` だけだと配列そのものが出る。`[]` を足すと 1 要素ずつになる",
      "各要素はオブジェクトなので、`.name` でフィールドを取り出せる",
      "答えは `.users[].name`",
    ],
  },
  initialCode: `.users[]`,
  solutionCode: `.users[].name`,
});
