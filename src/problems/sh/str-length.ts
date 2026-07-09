import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-str-length",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "シェルで文字数を数える",
    prompt: `## やること

変数 \`s\` に入った \`wasm\` の **文字数** を出力しよう。

期待する出力:

\`\`\`
4
\`\`\`

## ヒント: パラメータ展開 \${#s}

- bash では **\`\${#s}\`** で変数の中身の文字数が取れる
- \`echo "\${#s}"\``,
    hints: ["変数はすでに `s=wasm`", "`${#s}` で文字数になる", '答えは `echo "${#s}"`'],
  },
  initialCode: `s="wasm"
# s の文字数を出力しよう
`,
  solutionCode: `s="wasm"
echo "\${#s}"`,
});
