import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "decode-bash-case",
  stage: "decode",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "case 文の骨組みを読む",
    prompt: `## case の \`)\` は普通の括弧とペアじゃない

\`case ... in\` から \`esac\` までが1つの分岐（switch のような構文）。
各パターンの後ろの \`)\` は、対応する \`(\` を持たない **bash 独特の記号**。

\`\`\`bash
case $n in
  1) echo "Mon" ;;
  *) echo "invalid" ;;
esac
\`\`\`

右のコードの言葉を **クリック** して確かめよう。`,
    hints: [
      "`case`・`in`・`esac` は予約語。`case` を逆から読むと `esac`。",
      "パターンの後ろの `)` は開き括弧なしで使う。",
      "`;;` はその分岐の終わりの目印。",
      "`*` は「どのパターンにも一致しなかったとき」を表すワイルドカード。",
    ],
  },
  decode: {
    code: `case $n in\n  1) echo "Mon" ;;\n  *) echo "invalid" ;;\nesac`,
    quiz: [
      {
        prompt: "`case`・`in`・`esac` は予約語？ それとも自分で付けた名前？",
        choices: ["予約語", "自分で付けた名前"],
        answer: "予約語",
        explain: "3つとも bash が決めた予約語。`case ... in` から `esac` までが1つの分岐構文。",
      },
      {
        prompt: "`$n` は何を表す？",
        snippet: `case $n in`,
        choices: ["変数 n の中身を読み出す", "変数という名前そのもの", "数値の n"],
        answer: "変数 n の中身を読み出す",
        explain: "`$` は「変数の中身を展開して使う」という記号。`$n` は変数 `n` の値そのもの。",
      },
      {
        prompt: "`1)` の `)` は何とペアになっている？",
        snippet: `1) echo "Mon" ;;`,
        choices: [
          "ペアの `(` はない。case の1つのパターンを閉じる記号",
          "直前の `(`",
          "行末の `;;`",
        ],
        answer: "ペアの `(` はない。case の1つのパターンを閉じる記号",
        explain:
          "case のパターンは `パターン) 処理 ;;` の形。この `)` は開き括弧を持たない、case 独特の書き方。",
      },
      {
        prompt: "`*)` の `*` は何を意味する？",
        snippet: `*) echo "invalid" ;;`,
        choices: [
          "どのパターンにも一致しなかったときの「なんでも」",
          "掛け算",
          "コメントの開始",
        ],
        answer: "どのパターンにも一致しなかったときの「なんでも」",
        explain: "`*` はワイルドカード。他のどのパターンにも一致しないときに、最後の受け皿として使う。",
      },
      {
        prompt: "`;;` は何を表す？",
        snippet: `echo "Mon" ;;`,
        choices: [
          "その分岐（パターン）の終わり",
          "コマンドを2回実行する印",
          "コメントの開始",
        ],
        answer: "その分岐（パターン）の終わり",
        explain: "`;;` は1つの分岐の終わりの目印。ここで case 文から抜ける。",
      },
    ],
  },
});
