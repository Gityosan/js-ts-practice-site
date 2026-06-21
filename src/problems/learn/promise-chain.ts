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

## \`.then\` の中と、fetch の「後ろの行」どっちが先？

\`.then\` の中身は「結果が返ってから」走る＝**後回し（非同期）**。一方、fetch を呼んだ**直後の行**はそのまま**先に**実行される。

\`\`\`ts
fetch("/data.json").then(() => {
  console.log("A: then の中");
});
console.log("B: fetch の後ろの行");

// 出力は B → A
\`\`\`

**通信が一瞬で終わっても結果は同じ**。\`.then\` のコールバックは必ず「今動いている同期処理が全部終わったあと」に回される。だから後ろの行の方が先。

つまり \`.then\` の結果を **fetch の下の行で使うことはできない**（まだ走っていない）。続けて処理したいなら \`.then\` の中に書くか、\`await\` でつなぐ。

\`\`\`ts
// await なら「上から順」に見えるとおり
const res = await fetch("/data.json");
console.log("先");  // fetch 完了後
console.log("次");  // その後
\`\`\`

## ただし「B → A」は後ろが同期コードのときだけ

間に \`await\`（中断する処理）が入ると、その**待っている隙に \`.then\` が割り込める**。

\`\`\`ts
fetch("/x").then(() => console.log("A"));
await new Promise((r) => setTimeout(r, 3000)); // 3秒待つ
console.log("B");
// fetch が3秒以内に終われば、待っている間に A が走る → A → B
\`\`\`

- 後ろが**同期コードだけ**なら、fetch が速くても必ず **B → A**。
- 間に \`await\` があると、A（then）と B は「fetch の所要時間」対「await の待ち時間」の**レース**。待ちが長いほど A が先になりやすい。

（補足：\`setTimeout\` は Promise を返さないので \`await setTimeout(...)\` では待てない。\`await new Promise((r) => setTimeout(r, ms))\` と書く。）`,
    hints: [
      ".then は成功時、.catch は失敗時。",
      ".finally は結果に関わらず必ず最後に実行される。",
      ".then の中は後回し。fetch の直後に書いた行の方が先に動く（B → A）。",
      ".then の結果を fetch の下の行で使うことはできない。中に書くか await。",
      "B → A は後ろが同期コードのときだけ。間に await を挟むとレースになる。",
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
        prompt: "次のコードの出力順は？",
        snippet: `fetch("/x").then(() => console.log("A"));
console.log("B");`,
        choices: ["B → A", "A → B", "毎回バラバラ"],
        answer: "B → A",
        explain:
          ".then の中は後回し（非同期）。fetch の直後の `console.log(\"B\")` が先に走り、その後 A。通信が速くても変わらない。",
      },
      {
        prompt: "`.then` で受け取った結果を、fetch の「下の行」で使える？",
        choices: ["使えない（then の中はまだ走っていない）", "使える", "通信が速ければ使える"],
        answer: "使えない（then の中はまだ走っていない）",
        explain:
          "下の行（同期コード）は .then の中より先に動くので、結果はまだ無い。続けて使うなら .then の中に書くか await でつなぐ。",
      },
      {
        prompt:
          "`fetch(\"/x\").then(() => console.log(\"A\"))` の後に `await`（3秒待ち）→ `console.log(\"B\")`。fetch が1秒で終わるなら？",
        snippet: `fetch("/x").then(() => console.log("A"));
await new Promise((r) => setTimeout(r, 3000));
console.log("B");`,
        choices: ["A → B", "B → A", "毎回 B → A で不変"],
        answer: "A → B",
        explain:
          "await で待っている3秒の隙に、1秒で終わった fetch の .then(A) が走る。await が明けてから B。同期コードのときと違い、await を挟むと割り込まれる。",
      },
    ],
  },
});
