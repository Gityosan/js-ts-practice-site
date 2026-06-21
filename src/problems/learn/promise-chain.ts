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
| \`.finally\` | 成功・失敗どちらでも最後に |

## 順序が「保証される」とき・「されない」とき

**保証される**：1本のチェーン、または1つの \`async\` 関数の中で \`await\` を上から順に書いたとき。前が終わってから次、が守られる。

\`\`\`ts
// async 関数：上から順
await stepA();
await stepB(); // A が終わってから B

// チェーン：つないだ順
fetchUser().then(saveUser).then(notify); // 取得 → 保存 → 通知
\`\`\`

**保証されない**：互いに \`await\` でつないでいない、**別々に走らせた**非同期処理どうし。どちらが先に終わるかは**所要時間しだい**。

\`\`\`ts
doA(); // await しない
doB(); // await しない
// A と B のどちらの .then が先に走るかは不定（書いた順とは限らない）
\`\`\`

順序を守りたいなら \`await\` でつなぐ／チェーンにする。並行で走らせて「全部終わったら次」は \`await Promise.all([doA(), doB()])\`（ただし2つの**完了順**自体は保証されない）。`,
    hints: [
      ".then は成功時、.catch は失敗時。",
      ".finally は結果に関わらず必ず最後に実行される。",
      "同じチェーン／連続 await の中は順序が守られる。",
      "別々に走らせた非同期は、終わる順が所要時間しだいで不定。",
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
      {
        prompt: "実行順序が必ず保証されるのはどれ？",
        choices: [
          "同じチェーンや連続 await で前後をつないだとき",
          "別々に呼んだ2つの非同期処理",
          "非同期なら常にどんな順序も保証される",
        ],
        answer: "同じチェーンや連続 await で前後をつないだとき",
        explain: "1本のチェーン／1つの async 関数内の連続 await は「前が終わってから次」が守られる。",
      },
      {
        prompt: "`await` せずに `doA(); doB();` と別々に走らせたとき、先に終わるのは？",
        snippet: `doA();
doB();`,
        choices: ["所要時間しだいで決まる（不定）", "必ず doA", "必ず doB"],
        answer: "所要時間しだいで決まる（不定）",
        explain:
          "互いに待っていない非同期処理は、書いた順ではなく早く終わった方が先。順序を守るなら await でつなぐ。",
      },
    ],
  },
});
