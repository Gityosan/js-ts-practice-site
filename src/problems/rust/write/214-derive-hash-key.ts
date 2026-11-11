import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-derive-hash-key",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Hash + Eq を derive して HashSet / HashMap のキーにする",
    prompt: `## やること

座標 \`Pos { x, y }\` を **HashSet の要素** や **HashMap のキー** に使えるようにしよう。

- （1）\`Pos\` に必要な derive を足す（\`Hash\` と \`Eq\`（と \`PartialEq\`）。結果をソートするので \`PartialOrd, Ord\` も）
- （2）\`unique_count(path: &[Pos]) -> usize\` … 何種類の座標を訪れたか（HashSet を使う）
- （3）\`visit_counts(path: &[Pos]) -> Vec<(Pos, usize)>\` … 座標ごとの訪問回数。**座標の昇順** にソートして返す（HashMap は順序がバラバラなので）

\`\`\`rust
let p = [Pos { x: 0, y: 0 }, Pos { x: 1, y: 0 }, Pos { x: 0, y: 0 }];
unique_count(&p)   // 2
visit_counts(&p)   // [(Pos { x: 0, y: 0 }, 2), (Pos { x: 1, y: 0 }, 1)]
\`\`\`

- HashMap / HashSet は **Hash** でしまう場所を決め、**Eq** で同じか確かめる
- 回数を数えるのは \`*map.entry(key).or_insert(0) += 1;\``,
    hints: [
      "`#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]`",
      "unique_count は `path.iter().collect::<HashSet<_>>().len()` でも書ける",
      "visit_counts は HashMap に数えてから `let mut v: Vec<(Pos, usize)> = map.into_iter().collect(); v.sort(); v`",
    ],
  },
  initialCode: `use std::collections::{HashMap, HashSet};

// 必要な derive を足そう
#[derive(Debug, Clone, Copy)]
struct Pos {
    x: i32,
    y: i32,
}

fn unique_count(path: &[Pos]) -> usize {
    todo!()
}

fn visit_counts(path: &[Pos]) -> Vec<(Pos, usize)> {
    todo!()
}
`,
  solutionCode: `use std::collections::{HashMap, HashSet};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
struct Pos {
    x: i32,
    y: i32,
}

fn unique_count(path: &[Pos]) -> usize {
    let mut set = HashSet::new();
    for p in path {
        set.insert(*p);
    }
    set.len()
}

fn visit_counts(path: &[Pos]) -> Vec<(Pos, usize)> {
    let mut map = HashMap::new();
    for p in path {
        *map.entry(*p).or_insert(0) += 1;
    }
    let mut v: Vec<(Pos, usize)> = map.into_iter().collect();
    v.sort();
    v
}
`,
});
