import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-as-ref-str",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "AsRef<str> と to_owned で柔軟な引数",
    prompt: `## やること

\`&str\` と \`String\` のどちらでも受け取れる関数を \`AsRef<str>\` で書こう。

- （1）\`count_vowels<S: AsRef<str>>(s: S) -> usize\` … 母音（a, e, i, o, u。小文字だけでよい）の数
- （2）\`total_len<T: AsRef<str>>(items: &[T]) -> usize\` … 全要素の文字列の **バイト長** の合計
- （3）\`with_suffix(s: &str) -> String\` … 末尾に \`"!"\` を付けた **新しい String**。\`to_owned()\` で所有する String を作ってから \`push\` / \`push_str\` しよう

\`\`\`rust
count_vowels("banana")                 // 3
count_vowels(String::from("rust"))     // 1
total_len(&["ab", "cde"])              // 5
total_len(&vec![String::from("xyz")])  // 3
with_suffix("hi")                      // "hi!"
\`\`\`

- \`s.as_ref()\` で \`&str\` を取り出せる`,
    hints: [
      '`s.as_ref().chars().filter(|c| "aeiou".contains(*c)).count()`（for ループでもよい）',
      "total_len は `for x in items { sum += x.as_ref().len(); }`",
      "with_suffix は `let mut out = s.to_owned(); out.push('!'); out`",
    ],
  },
  initialCode: `fn count_vowels<S: AsRef<str>>(s: S) -> usize {
    todo!()
}

fn total_len<T: AsRef<str>>(items: &[T]) -> usize {
    todo!()
}

fn with_suffix(s: &str) -> String {
    todo!()
}
`,
  solutionCode: `fn count_vowels<S: AsRef<str>>(s: S) -> usize {
    let mut n = 0;
    for c in s.as_ref().chars() {
        if "aeiou".contains(c) {
            n += 1;
        }
    }
    n
}

fn total_len<T: AsRef<str>>(items: &[T]) -> usize {
    let mut sum = 0;
    for x in items {
        sum += x.as_ref().len();
    }
    sum
}

fn with_suffix(s: &str) -> String {
    let mut out = s.to_owned();
    out.push('!');
    out
}
`,
});
