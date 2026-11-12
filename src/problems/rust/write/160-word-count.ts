import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-word-count-btreemap",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "単語の出現回数を数える（BTreeMap で返す）",
    prompt: `## やること

文章中の単語の出現回数を数える \`word_count(text: &str) -> BTreeMap<String, usize>\` を書こう。

- 単語は空白区切り（\`split_whitespace()\`）
- **大文字小文字は区別しない**（すべて小文字にしてから数える。\`to_lowercase()\`）
- 単語の前後についた \`.\` \`,\` \`!\` \`?\` は取り除く（\`trim_matches(|c: char| !c.is_alphanumeric())\`）。取り除いた結果が空なら数えない

\`\`\`rust
word_count("The cat. the DOG!");
// {"cat": 1, "dog": 1, "the": 2}
\`\`\`

さらに \`top_word(text: &str) -> Option<(String, usize)>\` を書こう。最も多い単語とその回数。同数なら **辞書順で先** の単語。空なら None。

集計には **entry API** を使う: \`*map.entry(key).or_insert(0) += 1;\`

BTreeMap はキーの昇順に並ぶので、結果の表示順が毎回同じになる（HashMap だと順序が不定）。`,
    hints: [
      "`for w in text.split_whitespace() { let w = w.trim_matches(|c: char| !c.is_alphanumeric()).to_lowercase(); ... }`",
      "`if w.is_empty() { continue; }`",
      "top_word: BTreeMap は辞書順に回るので、`count > best_count` のときだけ更新すれば同数で先の単語が残る",
    ],
  },
  initialCode: `use std::collections::BTreeMap;

fn word_count(text: &str) -> BTreeMap<String, usize> {
    todo!()
}

fn top_word(text: &str) -> Option<(String, usize)> {
    todo!()
}
`,
  solutionCode: `use std::collections::BTreeMap;

fn word_count(text: &str) -> BTreeMap<String, usize> {
    let mut map = BTreeMap::new();
    for w in text.split_whitespace() {
        let w = w.trim_matches(|c: char| !c.is_alphanumeric()).to_lowercase();
        if w.is_empty() {
            continue;
        }
        *map.entry(w).or_insert(0) += 1;
    }
    map
}

fn top_word(text: &str) -> Option<(String, usize)> {
    let mut best: Option<(String, usize)> = None;
    for (w, c) in word_count(text) {
        match &best {
            Some((_, bc)) if *bc >= c => {}
            _ => best = Some((w, c)),
        }
    }
    best
}
`,
});
