import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "learn-jq-pipe-basics",
  stage: "learn",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq の `.` と `|` を知る",
    prompt: `## jq は「今の値」を変形しながら渡していく

- **\`.\`** … 「今の値そのもの」（identity）。何も変えない。
- **\`.foo\`** … 今の値（オブジェクト）の \`foo\` フィールドを取り出す
- **\`.[0]\`** … 今の値（配列）の 0 番目の要素を取り出す
- **\`|\`** … 「左の結果を右に渡す」パイプ。複数のフィルタを繋げられる

## 例

入力 \`{ "users": [{ "name": "Aki" }] }\` に対して:

\`\`\`
.users          # → [{ "name": "Aki" }]（users フィールドの中身）
.users[0]       # → { "name": "Aki" }（先頭の要素）
.users[0].name  # → "Aki"（さらに name フィールド）
.users | length # → 1（users を渡してから length で数える）
\`\`\`

**\`|\` の右側は、左側の結果を「今の値」として受け取る**。`,
    hints: [
      "`.` は「今の値そのまま」。何もしない変換。",
      "`.foo.bar` のようにドットを続けるとネストしたフィールドを辿れる。",
      "`|` は左の結果を右のフィルタに渡す。上から下に読む。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: '入力 `{"a": 1}` に対して `.` を実行した結果は？',
        snippet: `{"a": 1} | .`,
        choices: ['{"a": 1}（そのまま）', "1", "エラーになる"],
        answer: '{"a": 1}（そのまま）',
        explain: "`.` は「今の値をそのまま返す」フィルタ。何も変換しない。",
      },
      {
        prompt: '入力 `{"a": 1}` に対して `.a` を実行した結果は？',
        snippet: `{"a": 1} | .a`,
        choices: ["1", '{"a": 1}', "null"],
        answer: "1",
        explain: "`.a` はオブジェクトの `a` フィールドを取り出す。",
      },
      {
        prompt: "入力 `[10, 20, 30]` に対して `.[1]` を実行した結果は？",
        snippet: `[10, 20, 30] | .[1]`,
        choices: ["20", "10", "30"],
        answer: "20",
        explain: "`.[n]` は配列の n 番目（0始まり）の要素を取り出す。`.[1]` は2番目の 20。",
      },
      {
        prompt: '入力 `{"users": [{"name": "A"}]}` に対して `.users | length` の結果は？',
        snippet: `.users | length`,
        choices: ["1", "0", "エラーになる"],
        answer: "1",
        explain:
          "まず `.users` で配列 `[{\"name\": \"A\"}]` を取り出し、それを `|` で `length` に渡して要素数を数える。結果は 1。",
      },
      {
        prompt: "`.foo | .bar` は何をしている？",
        choices: [
          ".foo の結果に対してさらに .bar を取り出す",
          ".foo と .bar を両方まとめて取り出す",
          "常にエラーになる",
        ],
        answer: ".foo の結果に対してさらに .bar を取り出す",
        explain: "`|` は左の結果を右のフィルタの入力にする。`.foo.bar` とほぼ同じ意味になる。",
      },
    ],
  },
});
