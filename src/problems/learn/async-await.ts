import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "learn-async-await",
  stage: "learn",
  scenario: "basic",
  copy: {
    title: "async / await を知る",
    prompt: `## 「待つ」処理を読みやすく書く

通信やファイル読み込みなど、**結果が後で返る処理**は \`Promise\` という形で返ってくる。
\`await\` を付けると、その完了を**待って**結果を受け取れる。

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
    ],
  },
});
