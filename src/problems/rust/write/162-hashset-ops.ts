import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-hashset-common",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "HashSet で共通要素・集合演算",
    prompt: `## やること

HashSet の集合演算を使って次の関数を書こう。HashSet の順序は不定なので、**結果は昇順にソートした Vec** で返す。

- \`common(a: &[i32], b: &[i32]) -> Vec<i32>\` … 両方に含まれる値（重複なし）。\`intersection\`
- \`only_in_first(a: &[i32], b: &[i32]) -> Vec<i32>\` … a にだけある値。\`difference\`
- \`all_unique(v: &[i32]) -> bool\` … 重複がなければ true（HashSet の \`insert\` は既にあると false を返す）
- \`first_repeat(s: &str) -> Option<char>\` … 2 回目に現れた最初の文字

\`\`\`rust
common(&[1, 2, 2, 3, 4], &[4, 2, 6]);   // [2, 4]
only_in_first(&[1, 2, 3], &[2]);       // [1, 3]
all_unique(&[1, 2, 1]);                // false
first_repeat("abcbad");                // Some('b')
\`\`\`

- スライスから集合: \`let sa: HashSet<i32> = a.iter().copied().collect();\`
- \`sa.intersection(&sb)\` は \`&i32\` のイテレータ → \`.copied().collect::<Vec<i32>>()\` してから \`sort()\``,
    hints: [
      "`let sa: HashSet<i32> = a.iter().copied().collect();` を a, b 両方作る",
      "`let mut v: Vec<i32> = sa.intersection(&sb).copied().collect(); v.sort(); v`",
      "all_unique: `for &x in v { if !seen.insert(x) { return false; } } true`",
      "first_repeat も同じく insert が false になった文字を返す",
    ],
  },
  initialCode: `use std::collections::HashSet;

fn common(a: &[i32], b: &[i32]) -> Vec<i32> {
    todo!()
}

fn only_in_first(a: &[i32], b: &[i32]) -> Vec<i32> {
    todo!()
}

fn all_unique(v: &[i32]) -> bool {
    todo!()
}

fn first_repeat(s: &str) -> Option<char> {
    todo!()
}
`,
  solutionCode: `use std::collections::HashSet;

fn common(a: &[i32], b: &[i32]) -> Vec<i32> {
    let sa: HashSet<i32> = a.iter().copied().collect();
    let sb: HashSet<i32> = b.iter().copied().collect();
    let mut v: Vec<i32> = sa.intersection(&sb).copied().collect();
    v.sort();
    v
}

fn only_in_first(a: &[i32], b: &[i32]) -> Vec<i32> {
    let sa: HashSet<i32> = a.iter().copied().collect();
    let sb: HashSet<i32> = b.iter().copied().collect();
    let mut v: Vec<i32> = sa.difference(&sb).copied().collect();
    v.sort();
    v
}

fn all_unique(v: &[i32]) -> bool {
    let mut seen = HashSet::new();
    for &x in v {
        if !seen.insert(x) {
            return false;
        }
    }
    true
}

fn first_repeat(s: &str) -> Option<char> {
    let mut seen = HashSet::new();
    for c in s.chars() {
        if !seen.insert(c) {
            return Some(c);
        }
    }
    None
}
`,
});
