import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-iter-adapters-mix",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "filter_map / fold / flat_map / take_while / skip / chain / rev",
    prompt: `## やること

いろいろなアダプタと消費者を 1 つずつ使ってみよう。全部 1 行のチェーンで書ける。

| 関数 | やること | 例 |
|---|---|---|
| \`parse_valid(v: &[&str]) -> Vec<i32>\` | 整数として読めるものだけ（\`filter_map\`） | \`["1","x","3"]\` → \`[1, 3]\` |
| \`product(v: &[i64]) -> i64\` | 積（\`fold\`。空なら 1） | \`[2, 3, 4]\` → \`24\` |
| \`all_chars(words: &[&str]) -> Vec<char>\` | 全単語の文字を順に並べる（\`flat_map\`） | \`["ab","c"]\` → \`['a','b','c']\` |
| \`sum_until_negative(v: &[i32]) -> i32\` | 最初の負の数の手前までの合計（\`take_while\`） | \`[3, 4, -1, 10]\` → \`7\` |
| \`middle(v: &[i32]) -> Vec<i32>\` | 先頭と末尾を除いた部分（\`skip\` と \`take\`。3 個未満なら空） | \`[1,2,3,4]\` → \`[2, 3]\` |
| \`joined_rev(a: &[i32], b: &[i32]) -> Vec<i32>\` | a の後ろに b をつなげて逆順に（\`chain\` と \`rev\`） | \`[1,2]\`, \`[3]\` → \`[3, 2, 1]\` |`,
    hints: [
      "`v.iter().filter_map(|s| s.parse().ok()).collect()`、`v.iter().fold(1, |acc, x| acc * x)`",
      "`words.iter().flat_map(|w| w.chars()).collect()`、`v.iter().take_while(|&&x| x >= 0).sum()`",
      "`v.iter().skip(1).take(v.len().saturating_sub(2)).copied().collect()`、`a.iter().chain(b.iter()).rev().copied().collect()`",
    ],
  },
  initialCode: `fn parse_valid(v: &[&str]) -> Vec<i32> {
    todo!()
}

fn product(v: &[i64]) -> i64 {
    todo!()
}

fn all_chars(words: &[&str]) -> Vec<char> {
    todo!()
}

fn sum_until_negative(v: &[i32]) -> i32 {
    todo!()
}

fn middle(v: &[i32]) -> Vec<i32> {
    todo!()
}

fn joined_rev(a: &[i32], b: &[i32]) -> Vec<i32> {
    todo!()
}
`,
  solutionCode: `fn parse_valid(v: &[&str]) -> Vec<i32> {
    v.iter().filter_map(|s| s.parse().ok()).collect()
}

fn product(v: &[i64]) -> i64 {
    v.iter().fold(1, |acc, x| acc * x)
}

fn all_chars(words: &[&str]) -> Vec<char> {
    words.iter().flat_map(|w| w.chars()).collect()
}

fn sum_until_negative(v: &[i32]) -> i32 {
    v.iter().take_while(|&&x| x >= 0).sum()
}

fn middle(v: &[i32]) -> Vec<i32> {
    v.iter().skip(1).take(v.len().saturating_sub(2)).copied().collect()
}

fn joined_rev(a: &[i32], b: &[i32]) -> Vec<i32> {
    a.iter().chain(b.iter()).rev().copied().collect()
}
`,
});
