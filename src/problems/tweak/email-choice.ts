import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "tweak-email-choice",
  stage: "tweak",
  scenario: "email",
  copy: {
    title: "キーワードを選んで関数を組み立てる③",
    prompt: `## やること

送信済みリストに入っていないアドレスを絞り込み、まとめてメールを送るコードを完成させよう。

\`allRecipients\` から \`contacted\` に含まれるアドレスを除いた配列を作り、
\`GmailApp.sendEmail\` に渡す。

## 正解例のイメージ

\`\`\`ts
// contacted に含まれていないアドレスだけ残す
const pending = allRecipients.filter(e => !contacted.includes(e));
// → ["alice@co.jp", "carol@co.jp"]
GmailApp.sendEmail(pending.join(","), "週次レポート", "お世話になっております");
\`\`\`

## 選ぶポイント

- **配列メソッド**: 絞り込んで**新しい配列**を返すのはどれ？
- **判定メソッド**: 配列に値が含まれているかを調べるのはどれ？`,
    hints: [
      "`filter` は条件に合う要素だけの新しい配列を返す / `map` は変換 / `find` は最初の1件",
      "`includes(e)` で配列に `e` が含まれるか true/false が取れる",
      "`!contacted.includes(e)` で「まだ送っていない」を表現できる",
    ],
  },
  tweak: {
    kind: "choice",
    template: `const allRecipients = ["alice@co.jp", "bob@co.jp", "carol@co.jp"];
const contacted = ["bob@co.jp"];
const pending = allRecipients.{{0}}(e => !contacted.{{1}}(e));
GmailApp.sendEmail(pending.join(","), "週次レポート", "お世話になっております");`,
    blanks: [
      { choices: ["filter", "map", "find"], answer: "filter" },
      { choices: ["includes", "indexOf", "push"], answer: "includes" },
    ],
  },
  initialCode: `const allRecipients = ["alice@co.jp", "bob@co.jp", "carol@co.jp"];
const contacted = ["bob@co.jp"];
const pending = allRecipients.filter(e => !contacted.includes(e));
GmailApp.sendEmail(pending.join(","), "週次レポート", "お世話になっております");`,
  solutionCode: `const allRecipients = ["alice@co.jp", "bob@co.jp", "carol@co.jp"];
const contacted = ["bob@co.jp"];
const pending = allRecipients.filter(e => !contacted.includes(e));
GmailApp.sendEmail(pending.join(","), "週次レポート", "お世話になっております");`,
});
