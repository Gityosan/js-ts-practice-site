import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "decode-bash-function-def",
  stage: "decode",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "関数定義の ( ) { } を読む",
    prompt: `## 括弧の意味は「直前の言葉」で決まる

同じ \`( )\` \`{ }\` でも、直前に何が来ているかで意味が変わる。

\`\`\`bash
greet() {
  echo "Hi, $1!"
}
\`\`\`

- \`greet\` の直後の **\`( )\`** … 関数の引数リスト（bash では基本、空にする）
- その直後の **\`{ }\`** … 関数の本体（処理のまとまり）

右のコードの言葉を **クリック** して確かめよう。`,
    hints: [
      "`greet` は自分で付けた関数名。別の名前でも動く。",
      "`()` は「これは関数だ」という目印。中身は空でOK。",
      "`$1` は関数を呼び出したときの1番目の引数。",
    ],
  },
  decode: {
    code: `greet() {\n  echo "Hi, $1!"\n}`,
    quiz: [
      {
        prompt: "`greet` は予約語？ それとも自分で付けた名前？",
        choices: ["自分で付けた名前", "予約語"],
        answer: "自分で付けた名前",
        explain: "`greet` は作者が付けた関数名（open-class）。`say_hi` でも何でも動く。",
      },
      {
        prompt: "`greet` の直後にある `( )` は何を表す？",
        snippet: `greet() { ... }`,
        choices: [
          "関数の引数リスト（bash では空にするのが基本）",
          "算術式の計算",
          "配列の要素アクセス",
        ],
        answer: "関数の引数リスト（bash では空にするのが基本）",
        explain:
          "`名前()` の形は関数定義の目印。JS と違い、bash の `()` は基本空のまま。引数は中で `$1` `$2` として受け取る。",
      },
      {
        prompt: "`( )` の直後の `{ }` は何を表す？",
        snippet: `greet() { echo "Hi, $1!" }`,
        choices: ["関数の本体（処理のまとまり）", "配列リテラル", "コメント"],
        answer: "関数の本体（処理のまとまり）",
        explain: "`{ }` は関数の中身。引数リスト `( )` の直後にあるので『本体』だとわかる。",
      },
      {
        prompt: "`echo \"Hi, $1!\"` の `$1` は何を表す？",
        snippet: `$1`,
        choices: [
          "この関数を呼び出したときの1番目の引数",
          "「1」という名前の変数",
          "グローバル変数",
        ],
        answer: "この関数を呼び出したときの1番目の引数",
        explain: "bash の関数では `$1`・`$2`… が『呼び出し時に渡された引数』を表す。",
      },
    ],
  },
});
