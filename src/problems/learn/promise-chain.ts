import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "learn-promise-chain",
  stage: "learn",
  scenario: "basic",
  copy: {
    title: "then / catch / finally を知る",
    prompt: `## Promise のもう一つの書き方

\`await\` を使わず、\`.then()\` をつなげて結果を受け取る書き方もある。

\`\`\`ts
fetch("/data.json")
  .then((res) => res.json())  // 成功したら次へ
  .then((json) => console.log(json))
  .catch((err) => console.log("失敗:", err)) // どこかで失敗したら
  .finally(() => console.log("おわり"));      // 成功・失敗どちらでも
\`\`\`

| メソッド | いつ呼ばれる |
|---|---|
| \`.then\` | 成功したとき（成功値を受け取る） |
| \`.catch\` | 失敗（エラー）したとき |
| \`.finally\` | 成功・失敗どちらでも最後に |`,
    hints: [
      ".then は成功時、.catch は失敗時。",
      ".finally は結果に関わらず必ず最後に実行される。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "処理が失敗（エラー）したときに呼ばれるのは？",
        choices: [".catch", ".then", ".finally"],
        answer: ".catch",
        explain: "エラー時は `.catch` が呼ばれ、エラー内容を受け取れる。",
      },
      {
        prompt: "成功でも失敗でも最後に必ず呼ばれるのは？",
        choices: [".finally", ".then", ".catch"],
        answer: ".finally",
        explain: "`.finally` は結果に関わらず最後に実行される（後始末に使う）。",
      },
      {
        prompt: "`.then((value) => ...)` の value は何？",
        choices: ["成功した結果の値", "エラー", "常に undefined"],
        answer: "成功した結果の値",
        explain: "`.then` のコールバックには、前の処理が成功して返した値が渡る。",
      },
    ],
  },
});
