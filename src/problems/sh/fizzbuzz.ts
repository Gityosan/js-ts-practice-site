import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "bash-sh-fizzbuzz",
  stage: "write",
  language: "bash",
  scenario: "sh",
  copy: {
    title: "FizzBuzz を出力する",
    prompt: `## やること

1 から 15 まで、次のルールで 1 行ずつ出力するスクリプトを書こう（定番の FizzBuzz）。

- 3 の倍数のときは \`Fizz\`
- 5 の倍数のときは \`Buzz\`
- 3 と 5 両方の倍数のときは \`FizzBuzz\`
- それ以外は数値そのまま

## ヒント: C 言語スタイルの for

\`\`\`bash
for ((i=1; i<=15; i++)); do
  if (( i % 15 == 0 )); then
    echo "FizzBuzz"
  elif (( i % 3 == 0 )); then
    echo "Fizz"
  elif (( i % 5 == 0 )); then
    echo "Buzz"
  else
    echo "$i"
  fi
done
\`\`\`

- **\`for ((i=1; i<=15; i++))\`** は bash 組み込みの C 言語スタイル for ループ
- 15 の倍数の判定を **先に** 書かないと 3 の倍数判定に先に引っかかってしまう`,
    hints: [
      "`for ((i=1; i<=15; i++)); do ... done`",
      "15 の倍数の判定を一番先に書く（3 と 5 両方より先）",
      "`(( i % 3 == 0 ))` のように `%` で判定",
    ],
  },
  initialCode: `for ((i=1; i<=15; i++)); do
  # ここに if / elif / else を書こう
  echo "$i"
done`,
  solutionCode: `for ((i=1; i<=15; i++)); do
  if (( i % 15 == 0 )); then
    echo "FizzBuzz"
  elif (( i % 3 == 0 )); then
    echo "Fizz"
  elif (( i % 5 == 0 )); then
    echo "Buzz"
  else
    echo "$i"
  fi
done`,
});
