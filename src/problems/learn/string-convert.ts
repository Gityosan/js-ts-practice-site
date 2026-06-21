import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "learn-string-convert",
  stage: "learn",
  scenario: "basic",
  copy: {
    title: "文字列変換を知る",
    prompt: `## 変数を文字列に埋め込む（テンプレートリテラル）

バッククォートで囲んだ文字列の中では、\`\${ }\` で変数を埋め込める。

\`\`\`ts
const name = "田中";
\`\${name}さん、こんにちは\`   // → "田中さん、こんにちは"
\`\`\`

## 数値などを文字列にする

\`\`\`ts
String(42)        // "42"
(42).toString()   // "42"
String(null)      // "null"（安全）
\`\`\`

- \`String(x)\` は **null / undefined でも安全**に変換できる。
- \`x.toString()\` は \`x\` が null / undefined だと**エラー**になる。`,
    hints: [
      "`${変数}` はバッククォートで囲んだ文字列の中だけで使える。",
      "null かもしれない値は String() で変換する方が安全。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: 'name が "田中" のとき、次の式の結果は？',
        snippet: "`${name}さん`",
        choices: ['"田中さん"', '"${name}さん"', '"nameさん"'],
        answer: '"田中さん"',
        explain: "テンプレートリテラルの ${name} は変数の中身に置き換わるので \"田中さん\"。",
      },
      {
        prompt: "数値 42 を文字列にする書き方は？",
        choices: ["String(42)", "Number(42)", "42.string"],
        answer: "String(42)",
        explain: "`String(42)` で \"42\" になる。`(42).toString()` でも同じ。",
      },
      {
        prompt: "値が null かもしれないとき、安全に文字列化できるのは？",
        choices: ["String(x)", "x.toString()"],
        answer: "String(x)",
        explain: "`String(null)` は \"null\" を返すが、`null.toString()` はエラーになる。",
      },
    ],
  },
});
