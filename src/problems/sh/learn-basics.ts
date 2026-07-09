import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-learn-basics",
  stage: "learn",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "シェルのキホンを知る",
    prompt: `## シェルスクリプトとは

**シェルスクリプト**は、コマンドを並べて自動化するための言語。
変数・繰り返し・条件分岐を組み合わせて、テキストを処理する。

右のクイズで基本を確認しよう。`,
    hints: [],
  },
  learn: {
    quiz: [
      {
        prompt: "変数 `x` の値を使うときの書き方は？",
        choices: ["`$x`", "`x`", "`&x`"],
        answer: "`$x`",
        explain: "代入は `x=5`（=の前後に空白なし）、参照は `$x` または `${x}`。",
      },
      {
        prompt: "`$(( ))` は何をする？",
        snippet: "s=$((a + b))",
        choices: ["算術（数値計算）をする", "コマンドの出力を取り込む", "文字列を連結する"],
        answer: "算術（数値計算）をする",
        explain: "`$(( ))` は算術展開。`$(( a + b ))` で足し算などができる。",
      },
      {
        prompt: "`for i in 1 2 3; do ... done` は？",
        choices: ["1,2,3 と順に繰り返す", "1回だけ実行する", "3 になるまで待つ"],
        answer: "1,2,3 と順に繰り返す",
        explain: "`for 変数 in 値の並び; do ... done` で各値についてループする。",
      },
      {
        prompt: '`[ "$a" -eq 1 ]` の `-eq` は？',
        snippet: 'if [ "$a" -eq 1 ]; then ... fi',
        choices: ["数値が等しいか比較する", "文字列が等しいか比較する", "変数を1にする"],
        answer: "数値が等しいか比較する",
        explain: '`-eq` は数値の等価比較。文字列の等価は `=`（例 `[ "$a" = "x" ]`）。',
      },
    ],
  },
});
