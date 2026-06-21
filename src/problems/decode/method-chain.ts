import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "decode-method-chain",
  stage: "decode",
  scenario: "basic",
  copy: {
    title: "メソッドチェーンを左から読む",
    prompt: `## . でつながったコードは「左から順番に」

\`a.filter(...).map(...)\` のように \`.\` でつながったコードは、
**左から順に処理が流れる**。一気に読まず、\`.\` ごとに区切って読むのがコツ。

- 名前の直後の \`( )\` → **メソッドの呼び出し**
- \`n => ...\` → **アロー関数**（\`=>\` の左が引数、右が処理）

右のコードをクリックして、\`filter\` → \`map\` の流れと、各 \`( )\` の役割を確かめよう。`,
    hints: [
      "`nums.filter(...)` でまず絞り込み、その結果に `.map(...)` で変換、と左から流れる。",
      "`n => n > 0` は「n を受け取って n > 0 を返す」小さな関数。",
    ],
  },
  decode: {
    code: `const result = nums.filter(n => n > 0).map(n => n * 2);`,
    quiz: [
      {
        prompt: "`filter` の直後の `( )` の意味は？",
        snippet: `nums.filter(n => n > 0)`,
        choices: ["メソッドの呼び出し", "引数の定義", "条件式"],
        answer: "メソッドの呼び出し",
        explain: "名前（filter）の直後の ( ) は『呼び出し』。中の `n => n > 0` を渡して filter を動かす。",
      },
      {
        prompt: "`n => n > 0` の `=>` は何を表す？",
        snippet: `n => n > 0`,
        choices: ["アロー関数（左が引数・右が処理）", "比較演算子", "代入"],
        answer: "アロー関数（左が引数・右が処理）",
        explain: "`=>` はアロー関数。左の `n` が引数、右の `n > 0` が「返す値」。小さな関数を1行で書ける。",
      },
      {
        prompt: "`.map(...)` はいつ実行される？",
        snippet: `.filter(n => n > 0).map(n => n * 2)`,
        choices: ["filter の結果に対して、次に実行される", "filter より先に実行される", "同時に実行される"],
        answer: "filter の結果に対して、次に実行される",
        explain: "チェーンは左から右へ。まず filter で絞り込み、その結果の配列に対して map が動く。",
      },
    ],
  },
});
