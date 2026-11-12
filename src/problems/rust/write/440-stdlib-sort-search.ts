import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-stdlib-sort-binary-search",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ソートと二分探索",
    prompt: `## やること

### 1. \`insert_sorted(v: &mut Vec<i32>, x: i32) -> usize\`

ソート済みの \`v\` に、ソート順を保ったまま \`x\` を挿入し、**挿入した位置** を返す。\`binary_search\` の \`Ok\` / \`Err\` どちらの位置でもそこに入れればよい（\`unwrap_or_else(|e| e)\` で 1 つにまとめられる）。

### 2. \`contains_all(sorted: &[i32], targets: &[i32]) -> bool\`

ソート済みの \`sorted\` に、\`targets\` のすべての値が含まれているかを \`binary_search\` で調べる。

### 3. \`sort_words(words: &mut Vec<String>)\`

単語を **長さの短い順**、同じ長さなら **辞書順** に並べ替える。

\`\`\`rust
let mut w = vec!["pear", "fig", "apple", "kiwi"] /* String にしたもの */;
sort_words(&mut w); // ["fig", "kiwi", "pear", "apple"]
\`\`\`

### 4. \`sort_floats(v: &mut Vec<f64>)\`

\`f64\` を昇順に並べる。\`f64\` は \`Ord\` ではないので \`sort_by(|a, b| a.total_cmp(b))\` を使う。`,
    hints: [
      "`let pos = v.binary_search(&x).unwrap_or_else(|e| e); v.insert(pos, x); pos`",
      "`targets.iter().all(|t| sorted.binary_search(t).is_ok())`",
      "`words.sort_by(|a, b| a.len().cmp(&b.len()).then_with(|| a.cmp(b)))`、または `sort_by_key(|w| (w.len(), w.clone()))`",
    ],
  },
  initialCode: `fn insert_sorted(v: &mut Vec<i32>, x: i32) -> usize {
    todo!()
}

fn contains_all(sorted: &[i32], targets: &[i32]) -> bool {
    todo!()
}

fn sort_words(words: &mut Vec<String>) {
    todo!()
}

fn sort_floats(v: &mut Vec<f64>) {
    todo!()
}
`,
  solutionCode: `fn insert_sorted(v: &mut Vec<i32>, x: i32) -> usize {
    let pos = v.binary_search(&x).unwrap_or_else(|e| e);
    v.insert(pos, x);
    pos
}

fn contains_all(sorted: &[i32], targets: &[i32]) -> bool {
    targets.iter().all(|t| sorted.binary_search(t).is_ok())
}

fn sort_words(words: &mut Vec<String>) {
    words.sort_by(|a, b| a.len().cmp(&b.len()).then_with(|| a.cmp(b)));
}

fn sort_floats(v: &mut Vec<f64>) {
    v.sort_by(|a, b| a.total_cmp(b));
}
`,
});
