import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "decode-for-loop",
  stage: "decode",
  scenario: "basic",
  copy: {
    title: "for ループの ( ) と { } を読む",
    prompt: `## for の ( ) は「条件」ではない

\`if\` の \`( )\` は条件式だった。でも \`for\` の \`( )\` は中身が違う。

- \`for (\` の \`( )\` → **ヘッダ**（\`;\` で区切られた3つ：初期化・条件・更新）
- その後の \`{ }\` → くり返し実行される**本体（ブロック）**

右のコードの \`(\` と \`{\` をクリックして、それぞれの役割を確かめよう。`,
    hints: [
      "for の ( ) は `初期化; 条件; 更新` の3部構成。`;` で区切られている。",
      "{ } の中は、条件が成り立つ間くり返し実行される。",
    ],
  },
  decode: {
    code: `let total = 0;
for (let i = 0; i < 3; i = i + 1) {
  total = total + i;
}`,
    quiz: [
      {
        prompt: "`for` の直後の `( )` の意味は？",
        snippet: `for (let i = 0; i < 3; i = i + 1)`,
        choices: ["ループのヘッダ（初期化・条件・更新）", "条件式", "関数の呼び出し"],
        answer: "ループのヘッダ（初期化・条件・更新）",
        explain:
          "`for` の ( ) は `;` で区切られた3部構成のヘッダ。`let i = 0`（初期化）/ `i < 3`（条件）/ `i = i + 1`（更新）。",
      },
      {
        prompt: "その後の `{ }` の意味は？",
        snippet: `) {
  total = total + i;
}`,
        choices: ["くり返し実行される本体（ブロック）", "オブジェクトリテラル", "ヘッダ"],
        answer: "くり返し実行される本体（ブロック）",
        explain: "ヘッダの `)` の直後の { } は本体。条件が成り立つ間、中の処理がくり返される。",
      },
    ],
  },
});
