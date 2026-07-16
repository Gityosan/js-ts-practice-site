import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-case-day",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "case で曜日に変換する",
    prompt: `## やること

標準入力から数値（1〜7）を 1 つ読み込み、\`case\` 文で曜日の英語表記（\`Mon\`〜\`Sun\`）に変換して出力しよう。範囲外の数値なら \`invalid\` と出力する。

## ヒント: case 文

\`\`\`bash
read n
case "$n" in
  1) echo "Mon" ;;
  2) echo "Tue" ;;
  *) echo "invalid" ;;
esac
\`\`\`

- **\`case ... in / ) ... ;; / esac\`** が基本形
- **\`*)\`** はどのパターンにも一致しなかったときの「デフォルト」`,
    hints: [
      '1〜7 それぞれに `n) echo "..." ;;` を用意する',
      '`*) echo "invalid" ;;` を最後に置く',
      "月火水木金土日 = Mon Tue Wed Thu Fri Sat Sun",
    ],
  },
  initialCode: `read n
case "$n" in
  # ここに 1)〜7) と *) を書こう
esac`,
  solutionCode: `read n
case "$n" in
  1) echo "Mon" ;;
  2) echo "Tue" ;;
  3) echo "Wed" ;;
  4) echo "Thu" ;;
  5) echo "Fri" ;;
  6) echo "Sat" ;;
  7) echo "Sun" ;;
  *) echo "invalid" ;;
esac`,
});
