import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "decode-bash-if-arith",
  stage: "decode",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "if / (( )) の骨組みを読む",
    prompt: `## bash にも「予約語」と「自分の名前」がある

- **予約語**（紫）… bash が構造を作るために決めている言葉。\`if\`\`then\`\`fi\` など。
- **自分で付けた名前 / コマンド名**（水色）… 変数名や \`echo\` のようなコマンド。無限にある。

右のコードの言葉を **クリック** して確かめよう。
\`(( ))\` は「算術式（計算・比較）」を評価する場所。この中では \`$\` を付けずに変数を数値として使える。`,
    hints: [
      "紫（if・then・fi）は暗記する対象。決まった形でしか使えない。",
      "`n` は自分が付けた変数名。別の名前でも動く。",
      "`(( ))` の中だけは `$n` ではなく `n` のまま書ける。",
    ],
  },
  decode: {
    code: `if (( n % 2 == 0 )); then echo "even"; fi`,
    quiz: [
      {
        prompt: "`if`・`then`・`fi` は予約語？ それとも自分で付けた名前？",
        choices: ["予約語", "自分で付けた名前"],
        answer: "予約語",
        explain:
          "`if`・`then`・`fi` は bash が決めた予約語（closed-class）。別の言葉には変えられない。`if ... then ... fi` で1つの if 文になる。",
      },
      {
        prompt: "`n` は予約語？ それとも自分で付けた名前？",
        snippet: `(( n % 2 == 0 ))`,
        choices: ["自分で付けた名前", "予約語"],
        answer: "自分で付けた名前",
        explain: "`n` は変数名。作者が好きに付けた名前（open-class）で、別の名前でも動く。",
      },
      {
        prompt: "`(( ))` の中は何をしている？",
        snippet: `(( n % 2 == 0 ))`,
        choices: ["算術式を評価して真偽を判定している", "文字列を連結している", "コマンドを実行している"],
        answer: "算術式を評価して真偽を判定している",
        explain:
          "`(( ))` は算術式（計算・比較）の評価専用。中では `$` なしで変数を数値として扱える点が特殊。",
      },
      {
        prompt: "`echo` は予約語？ それとも自分で付けた名前？",
        choices: ["自分で付けた名前（コマンド名）", "予約語"],
        answer: "自分で付けた名前（コマンド名）",
        explain:
          "`echo` は bash の構文そのものではなく、たくさんあるコマンドの1つ。`if`・`then`・`fi` のような予約語とは種類が違う。",
      },
    ],
  },
});
