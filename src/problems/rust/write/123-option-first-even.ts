import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-option-first-even",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "最初の偶数を探す（Option を返す）",
    prompt: `## やること

スライスを調べて結果を \`Option\` で返す関数を 3 つ書こう。見つからないことがあるので戻り値は Option。

- \`first_even(v: &[i32]) -> Option<i32>\` … 最初の偶数。なければ None
- \`index_of(v: &[i32], target: i32) -> Option<usize>\` … \`target\` が最初に現れる位置
- \`max_value(v: &[i32]) -> Option<i32>\` … 最大値。**空なら None**

\`\`\`rust
first_even(&[1, 3, 4, 6]);   // Some(4)
first_even(&[1, 3]);         // None
index_of(&[5, 7, 9], 9);     // Some(2)
max_value(&[]);              // None
\`\`\`

- for ループで見つけたら \`return Some(x);\`、最後まで見つからなければ \`None\`
- 位置が欲しいときは \`for (i, &x) in v.iter().enumerate()\`
- （発展）\`v.iter().find(..)\`, \`v.iter().position(..)\`, \`v.iter().max()\` も Option を返す`,
    hints: [
      "`for &x in v { if x % 2 == 0 { return Some(x); } } None`",
      "負の偶数も `x % 2 == 0` で判定できる",
      "max_value は `let mut best: Option<i32> = None;` を更新していくか `v.iter().copied().max()`",
    ],
  },
  initialCode: `fn first_even(v: &[i32]) -> Option<i32> {
    todo!()
}

fn index_of(v: &[i32], target: i32) -> Option<usize> {
    todo!()
}

fn max_value(v: &[i32]) -> Option<i32> {
    todo!()
}
`,
  solutionCode: `fn first_even(v: &[i32]) -> Option<i32> {
    for &x in v {
        if x % 2 == 0 {
            return Some(x);
        }
    }
    None
}

fn index_of(v: &[i32], target: i32) -> Option<usize> {
    for (i, &x) in v.iter().enumerate() {
        if x == target {
            return Some(i);
        }
    }
    None
}

fn max_value(v: &[i32]) -> Option<i32> {
    let mut best: Option<i32> = None;
    for &x in v {
        best = match best {
            Some(b) if b >= x => Some(b),
            _ => Some(x),
        };
    }
    best
}
`,
});
