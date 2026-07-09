import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-uppercase",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "シェルで大文字に変換する",
    prompt: `## やること

変数 \`s\` に入った \`hello\` を **すべて大文字**にして出力しよう。

期待する出力:

\`\`\`
HELLO
\`\`\`

## ヒント: パラメータ展開 \${s^^}

- bash では **\`\${s^^}\`** で変数の中身を全部大文字にできる（\`\${s^}\` は先頭だけ）
- \`echo "\${s^^}"\``,
    hints: ["変数はすでに `s=hello`", "`${s^^}` で全部大文字になる", '答えは `echo "${s^^}"`'],
  },
  initialCode: `s="hello"
# s を大文字にして出力しよう
`,
  solutionCode: `s="hello"
echo "\${s^^}"`,
});
