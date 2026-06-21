import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "learn-async-await",
  stage: "learn",
  scenario: "basic",
  copy: {
    title: "async / await を知る",
    prompt: `## 同期処理と非同期処理

- **同期処理**：上から順に1つずつ実行し、**終わるまで次に進まない**。重い処理があると、その間ずっと止まって見える。
- **非同期処理**：通信やファイル読み込みなど時間のかかる処理を**待たずに先へ進み**、結果が出たら受け取る。だから固まらない。

\`\`\`ts
console.log("1");
setTimeout(() => console.log("3"), 1000); // 非同期：1秒後に実行
console.log("2");
// 出力順は 1 → 2 → 3（3 だけ後回し）
\`\`\`

## Promise という型

時間のかかる非同期処理は、結果を直接返せない（まだ無いから）。代わりに **「未来に値が入る箱」= \`Promise\`** を返す。

- Promise は3つの状態を持つ：**pending（待ち）→ fulfilled（成功）/ rejected（失敗）**。
- 中身は直接取り出せない。**\`await\`** か **\`.then()\`** で受け取る。
- 型は \`Promise<T>\`（例：\`Promise<string>\` は「いずれ string が入る」）。

## 「待つ」処理を読みやすく書く

\`await\` を付けると、その Promise の完了を**待って**結果を受け取れる。

\`\`\`ts
async function load() {
  const res = await fetch("/data.json"); // 完了を待つ
  const json = await res.json();         // これも待つ
  return json;
}
\`\`\`

## ルール

- \`await\` は **\`async\` 関数の中だけ**で使える。
- \`async\` を付けた関数は、戻り値が自動的に **\`Promise\`** になる。
- だから \`load()\` の結果を使うときも \`await load()\` のように待つ。`,
    hints: [
      "await は async 関数の中でしか使えない。",
      "async 関数は中で return した値を Promise に包んで返す。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`await` は何を待つ？",
        choices: ["Promise の完了", "ページの再読み込み", "ユーザーのクリック"],
        answer: "Promise の完了",
        explain: "`await` は Promise が解決（完了）するのを待って、その結果を取り出す。",
      },
      {
        prompt: "`async function f() { ... }` の戻り値の型は？",
        choices: ["Promise", "ただの値", "void 固定"],
        answer: "Promise",
        explain: "async を付けた関数の戻り値は必ず Promise になる。",
      },
      {
        prompt: "`await` が使えるのはどこ？",
        choices: ["async 関数の中", "どこでも", "if の中だけ"],
        answer: "async 関数の中",
        explain: "`await` は `async` 関数の内側でのみ使える（トップレベルの例外はここでは置いておく）。",
      },
      {
        prompt: "非同期処理の特徴として正しいのは？",
        choices: [
          "時間のかかる処理を待たずに次へ進める",
          "必ず上から順に1つずつ終わるまで止まる",
          "同期処理より必ず速い",
        ],
        answer: "時間のかかる処理を待たずに次へ進める",
        explain: "非同期は完了を待たずに先へ進み、結果が出たら受け取る。だから画面が固まらない（速さの話ではない）。",
      },
      {
        prompt: "`Promise` が表すものは？",
        choices: [
          "未来に手に入る値（成功か失敗をいずれ持つ）",
          "今すぐ確定している値",
          "ただのエラー",
        ],
        answer: "未来に手に入る値（成功か失敗をいずれ持つ）",
        explain:
          "Promise は「まだ無いが未来に決まる値」を表す箱。pending→fulfilled/rejected と状態が変わり、中身は await か .then で受け取る。",
      },
    ],
  },
});
