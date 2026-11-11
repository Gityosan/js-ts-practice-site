import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-palindrome-check",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "回文かどうか判定する",
    prompt: `## やること

文字列が **回文**（前から読んでも後ろから読んでも同じ）かどうかを返す関数 \`is_palindrome\` を書こう。ただし:

- **英数字以外（空白・記号）は無視** する
- **大文字と小文字は区別しない**

\`\`\`rust
is_palindrome("racecar")                          // true
is_palindrome("A man, a plan, a canal: Panama")   // true
is_palindrome("hello")                            // false
is_palindrome("")                                 // true（空は回文とみなす）
is_palindrome("たけやぶやけた")                     // true
\`\`\`

## 考え方

- まず「英数字だけを小文字にして並べた文字列」を作る
- それと、それを反転したものが等しいか比べる

## ポイント

- \`c.is_alphanumeric()\` … 英数字（日本語の文字なども含む）なら true
- \`c.to_lowercase()\` は **イテレータ** を返すので、\`for lc in c.to_lowercase() { s.push(lc); }\` か、\`s.extend(c.to_lowercase())\` で追加する
- 反転は \`s.chars().rev().collect::<String>()\`
- \`String\` 同士は \`==\` で比べられる`,
    hints: [
      "`let mut cleaned = String::new(); for c in s.chars() { if c.is_alphanumeric() { cleaned.extend(c.to_lowercase()); } }`",
      "`let reversed: String = cleaned.chars().rev().collect(); cleaned == reversed`",
    ],
  },
  initialCode: `fn is_palindrome(s: &str) -> bool {
    todo!()
}
`,
  solutionCode: `fn is_palindrome(s: &str) -> bool {
    let mut cleaned = String::new();
    for c in s.chars() {
        if c.is_alphanumeric() {
            cleaned.extend(c.to_lowercase());
        }
    }
    let reversed: String = cleaned.chars().rev().collect();
    cleaned == reversed
}
`,
});
