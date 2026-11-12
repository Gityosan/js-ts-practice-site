import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-iter-map-filter",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "map / filter / sum / collect の基本",
    prompt: `## やること

ループを使わず、**イテレータのメソッドチェーン** で 3 つの関数を書こう。

- （1）\`sum_even_squares(v: &[i32]) -> i32\` … 偶数だけを 2 乗して合計
- （2）\`word_lengths(s: &str) -> Vec<usize>\` … 空白区切りの各単語の文字数（\`split_whitespace\`）
- （3）\`shout_long(words: &[&str], min: usize) -> Vec<String>\` … 長さが min 以上の単語だけを大文字にして集める

\`\`\`rust
sum_even_squares(&[1, 2, 3, 4])           // 20   （4 + 16）
word_lengths("the quick  brown fox")      // [3, 5, 5, 3]
shout_long(&["a", "rust", "go", "zig"], 3) // ["RUST", "ZIG"]
\`\`\`

- \`.iter()\` → \`.filter(...)\` → \`.map(...)\` → \`.sum()\` / \`.collect()\`
- \`v.iter()\` の要素は \`&i32\`、filter のクロージャは \`&&i32\` を受け取る点に注意`,
    hints: [
      "`v.iter().filter(|&&x| x % 2 == 0).map(|&x| x * x).sum()`",
      "`s.split_whitespace().map(|w| w.chars().count()).collect()`",
      "`words.iter().filter(|w| w.len() >= min).map(|w| w.to_uppercase()).collect()`",
    ],
  },
  initialCode: `fn sum_even_squares(v: &[i32]) -> i32 {
    todo!()
}

fn word_lengths(s: &str) -> Vec<usize> {
    todo!()
}

fn shout_long(words: &[&str], min: usize) -> Vec<String> {
    todo!()
}
`,
  solutionCode: `fn sum_even_squares(v: &[i32]) -> i32 {
    v.iter().filter(|&&x| x % 2 == 0).map(|&x| x * x).sum()
}

fn word_lengths(s: &str) -> Vec<usize> {
    s.split_whitespace().map(|w| w.chars().count()).collect()
}

fn shout_long(words: &[&str], min: usize) -> Vec<String> {
    words
        .iter()
        .filter(|w| w.len() >= min)
        .map(|w| w.to_uppercase())
        .collect()
}
`,
});
