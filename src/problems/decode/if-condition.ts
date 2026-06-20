import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "decode-if-condition",
  stage: "decode",
  scenario: "basic",
  copy: {
    title: "if の ( ) は「条件」",
    prompt: `## 同じ ( ) でも、手前で意味が変わる

さっきの \`function name( )\` は引数の定義だった。
でも \`if\` の直後の \`( )\` は **条件式**になる。括弧の形は同じでも、**直前の予約語が違えば意味が違う**。

- \`if (\` → **条件式**（真なら下の { } を実行）
- \`double(\` → **関数の呼び出し**（名前の直後だから）

クリックして、2つの \`( )\` の意味の違いを確かめよう。`,
    hints: [
      "if の ( ) の中は「成り立つ/成り立たない」を判定する式。",
      "名前（identifier）の直後の ( ) は呼び出し。`double(price)` のように。",
    ],
  },
  decode: {
    code: `if (price > 1000) {
  label = double(price);
}`,
    quiz: [
      {
        prompt: "`if` の直後の `( )` の意味は？",
        snippet: `if (price > 1000)`,
        choices: ["条件式", "引数の定義", "関数の呼び出し"],
        answer: "条件式",
        explain: "`if` の直後の ( ) は『条件式』。中が真のとき、続く { } が実行される。",
      },
      {
        prompt: "`double` の直後の `( )` の意味は？",
        snippet: `double(price)`,
        choices: ["関数の呼び出し", "条件式", "引数の定義"],
        answer: "関数の呼び出し",
        explain:
          "名前（double）の直後に来る ( ) は『関数の呼び出し』。中の price を渡して double を動かしている。",
      },
      {
        prompt: "`)` の直後の `{ }` の意味は？",
        snippet: `if (price > 1000) {
  ...
}`,
        choices: ["ブロック（実行する処理のまとまり）", "オブジェクトリテラル", "引数の定義"],
        answer: "ブロック（実行する処理のまとまり）",
        explain: "条件の `)` の直後の { } は、条件が真のときに実行される処理のまとまり（ブロック）。",
      },
    ],
  },
});
