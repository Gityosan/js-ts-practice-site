import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "learn-boolean",
  stage: "learn",
  scenario: "basic",
  copy: {
    title: "論理値を知る",
    prompt: `## true と false 以外も「真偽」として扱われる

\`if\` などでは、\`true\`/\`false\` 以外の値も「真っぽい(truthy) / 偽っぽい(falsey)」で判定される。

**falsey（偽として扱う）はこれだけ**：

\`\`\`ts
false, 0, "", null, undefined, NaN
\`\`\`

**それ以外は全部 truthy**。例えば \`"0"\`（文字のゼロ）や \`[]\`（空配列）は truthy。

## ! で反転する

\`!\` は真偽を逆にする。

\`\`\`ts
!true     // false
!""       // true   （"" は falsey なので反転で true）
!!"hello" // true   （!! で「truthy かどうか」を true/false にできる）
\`\`\``,
    hints: [
      "falsey は false / 0 / \"\" / null / undefined / NaN の6つだけ。",
      '"0" は「文字のゼロ」なので truthy（空文字 "" だけが falsey）。',
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`!\"\"`（空文字を反転）の結果は？",
        snippet: `!""`,
        choices: ["true", "false"],
        answer: "true",
        explain: "空文字 \"\" は falsey。`!` で反転して true。",
      },
      {
        prompt: "次のうち truthy（真として扱う）なのは？",
        choices: ['"0"', "0", '""', "null"],
        answer: '"0"',
        explain: "`\"0\"` は中身のある文字列なので truthy。0 / \"\" / null は falsey。",
      },
      {
        prompt: "`!!\"hello\"` の結果は？",
        snippet: `!!"hello"`,
        choices: ["true", "false"],
        answer: "true",
        explain: "\"hello\" は truthy。`!!` は truthy かどうかを true/false に変換するので true。",
      },
    ],
  },
});
