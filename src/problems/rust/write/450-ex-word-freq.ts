import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ex-word-frequency-top",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "総合: 単語の出現回数トップ N",
    prompt: `## やること

文章から単語の出現回数を数え、多い順に上位 \`n\` 件を返す \`top_words(text: &str, n: usize) -> Vec<(String, usize)>\` を書こう。

## 仕様

- 単語は **英数字以外の文字** で区切る（\`split(|c: char| !c.is_alphanumeric())\`）。空の文字列は除く
- 大文字・小文字は区別しない（すべて小文字にしてから数える）
- 回数の **多い順**。同じ回数なら **単語の辞書順**
- \`n\` が単語の種類より多ければ全部返す

\`\`\`rust
top_words("The cat and the hat. The END!", 2)
// => [("the", 3), ("and", 1)]
\`\`\`

## 設計のヒント

- 数えるのは \`HashMap<String, usize>\` と \`*map.entry(w).or_insert(0) += 1\`
- HashMap の順序は不定なので、\`Vec\` に移してから \`sort_by\` で並べ、\`truncate(n)\` か \`take(n)\` する`,
    hints: [
      "`for w in text.split(|c: char| !c.is_alphanumeric()).filter(|w| !w.is_empty()) { *counts.entry(w.to_lowercase()).or_insert(0) += 1; }`",
      "`let mut v: Vec<(String, usize)> = counts.into_iter().collect();`",
      "`v.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(&b.0))); v.truncate(n);`",
    ],
  },
  initialCode: `use std::collections::HashMap;

fn top_words(text: &str, n: usize) -> Vec<(String, usize)> {
    todo!()
}
`,
  solutionCode: `use std::collections::HashMap;

fn top_words(text: &str, n: usize) -> Vec<(String, usize)> {
    let mut counts: HashMap<String, usize> = HashMap::new();
    for w in text
        .split(|c: char| !c.is_alphanumeric())
        .filter(|w| !w.is_empty())
    {
        *counts.entry(w.to_lowercase()).or_insert(0) += 1;
    }
    let mut v: Vec<(String, usize)> = counts.into_iter().collect();
    v.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(&b.0)));
    v.truncate(n);
    v
}
`,
});
