import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-jq-learn-basics",
  stage: "learn",
  language: "bash",
  scenario: "jq",
  copy: {
    title: "jq のキホンを知る",
    prompt: `## jq とは

**jq** は JSON を絞り込み・加工する CLI フィルタ言語。
標準入力の JSON を、パイプ \`|\` でつないだフィルタで少しずつ変換していく。

右のクイズで基本記号の意味を確認しよう。`,
    hints: [],
  },
  learn: {
    quiz: [
      {
        prompt: "`.name` は何を意味する？",
        snippet: ".name",
        choices: [
          "オブジェクトの name フィールドを取り出す",
          "name という文字列を出力する",
          "name 関数を呼び出す",
        ],
        answer: "オブジェクトの name フィールドを取り出す",
        explain: "先頭の `.` は入力そのもの。`.name` で name フィールドの値を取り出す。",
      },
      {
        prompt: "`.users[]` の `[]` の意味は？",
        snippet: ".users[]",
        choices: ["配列を1要素ずつに展開する", "空の配列を作る", "配列の長さを返す"],
        answer: "配列を1要素ずつに展開する",
        explain:
          "`[]` は配列を「各要素のストリーム」に展開する。以降のフィルタは各要素に適用される。",
      },
      {
        prompt: "パイプ `|` の役割は？",
        snippet: ".users[] | .name",
        choices: ["左の結果を右のフィルタに渡す", "2つの条件のORを取る", "配列を連結する"],
        answer: "左の結果を右のフィルタに渡す",
        explain: "`|` は左のフィルタの出力を右のフィルタの入力に渡す（シェルのパイプと同じ発想）。",
      },
      {
        prompt: "採点で使う `-r` オプションは何をする？",
        choices: ["文字列を引用符なし（raw）で出力する", "結果を逆順にする", "実行を高速化する"],
        answer: "文字列を引用符なし（raw）で出力する",
        explain: '`-r`（raw output）は文字列を `"Aki"` ではなく `Aki` のように引用符なしで出す。',
      },
    ],
  },
});
