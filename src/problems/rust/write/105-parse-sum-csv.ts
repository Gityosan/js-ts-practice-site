import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-parse-sum-csv",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "カンマ区切りの数を parse して合計する",
    prompt: `## やること

\`"1, 2, 3"\` のようなカンマ区切りの文字列を受け取り、数として読めた部分の **合計** を返す関数 \`sum_csv\` を書こう。

- 各要素の前後の空白は無視する
- 整数として読めない要素（空・文字など）は **0 として扱う**（無視するのと同じ）

\`\`\`rust
sum_csv("1, 2, 3")        // 6
sum_csv("10,-4, x, 5")    // 11（x は無視）
sum_csv("")               // 0
sum_csv(" 7 ")            // 7
\`\`\`

さらに、\`count_lines_with(text, word)\`: 複数行のテキストのうち、\`word\` を **含む行の数** を返す関数も書こう。

\`\`\`rust
count_lines_with("apple pie\\nbanana\\npineapple", "apple")   // 2
\`\`\`

## ポイント

- \`s.split(',')\` でカンマごとに分けた \`&str\` を順に取り出せる
- \`part.trim()\` で前後の空白を除く
- \`part.trim().parse::<i32>()\` は \`Result\`。\`.unwrap_or(0)\` で失敗時に 0 にできる
- \`text.lines()\` で 1 行ずつ、\`line.contains(word)\` で含むか判定`,
    hints: [
      "`let mut total = 0; for part in s.split(',') { total += part.trim().parse::<i32>().unwrap_or(0); } total`",
      "`for line in text.lines() { if line.contains(word) { n += 1; } }`",
    ],
  },
  initialCode: `fn sum_csv(s: &str) -> i32 {
    todo!()
}

fn count_lines_with(text: &str, word: &str) -> usize {
    todo!()
}
`,
  solutionCode: `fn sum_csv(s: &str) -> i32 {
    let mut total = 0;
    for part in s.split(',') {
        total += part.trim().parse::<i32>().unwrap_or(0);
    }
    total
}

fn count_lines_with(text: &str, word: &str) -> usize {
    let mut n = 0;
    for line in text.lines() {
        if line.contains(word) {
            n += 1;
        }
    }
    n
}
`,
});
