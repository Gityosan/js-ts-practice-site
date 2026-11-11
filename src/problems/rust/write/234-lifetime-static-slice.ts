import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-lifetime-static-slice",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "'static と、スライスの中の参照のライフタイム",
    prompt: `## やること

### 1. 'static を返す

\`grade(score: u32) -> &'static str\` … 点数から評価を返す。文字列リテラルは \`'static\` なのでそのまま返せる。

| 点数 | 評価 |
|---|---|
| 90 以上 | \`"A"\` |
| 70 以上 | \`"B"\` |
| 50 以上 | \`"C"\` |
| それ以外 | \`"F"\` |

### 2. スライスの中の参照を返す

\`longest_word<'a>(words: &[&'a str]) -> Option<&'a str>\` … 一番長い単語（同じ長さなら先のもの）。空なら \`None\`。

このシグネチャでは \`'a\` が **スライスの中の \`&str\`** に付いている（スライス自体の借用には付いていない）。だから、**Vec を捨てた後でも結果を使い続けられる**。

\`\`\`rust
let w;
{
    let v = vec!["aa", "bbb", "c"];
    w = longest_word(&v);   // v はこのブロックで破棄されるが…
}
w   // Some("bbb")  ← 文字列リテラルを指しているので OK
\`\`\``,
    hints: [
      'grade は `if score >= 90 { "A" } else if ...` か `match score { 90.. => "A", 70..=89 => "B", ... }`',
      "longest_word は `let mut best: Option<&'a str> = None;` から始めて for で更新",
      "`for &w in words { if best.map_or(true, |b| w.len() > b.len()) { best = Some(w); } }`",
    ],
  },
  initialCode: `fn grade(score: u32) -> &'static str {
    todo!()
}

fn longest_word<'a>(words: &[&'a str]) -> Option<&'a str> {
    todo!()
}
`,
  solutionCode: `fn grade(score: u32) -> &'static str {
    if score >= 90 {
        "A"
    } else if score >= 70 {
        "B"
    } else if score >= 50 {
        "C"
    } else {
        "F"
    }
}

fn longest_word<'a>(words: &[&'a str]) -> Option<&'a str> {
    let mut best: Option<&'a str> = None;
    for &w in words {
        match best {
            Some(b) if b.len() >= w.len() => {}
            _ => best = Some(w),
        }
    }
    best
}
`,
});
