import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-iter-consumers",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "any / all / find / position / min / max と iter_mut",
    prompt: `## やること

### 消費者を使う

\`(名前, 点数)\` のスライス \`&[(&str, u32)]\` を調べる関数を書こう。

| 関数 | やること | 使う消費者 |
|---|---|---|
| \`all_passed(v) -> bool\` | 全員 60 点以上か（空なら true） | \`all\` |
| \`any_perfect(v) -> bool\` | 100 点がいるか | \`any\` |
| \`first_failed(v) -> Option<&str>\` | 最初の 60 点未満の人の名前 | \`find\` |
| \`position_of(v, name) -> Option<usize>\` | その名前の位置 | \`position\` |
| \`score_range(v) -> Option<(u32, u32)>\` | (最低点, 最高点)。空なら None | \`min\` / \`max\` |

### iter_mut でその場で書き換える

\`add_bonus(v: &mut Vec<(&str, u32)>, bonus: u32)\` … 全員の点数に bonus を足す（**上限 100**）。\`iter_mut()\` を使う。

\`\`\`rust
let v = [("amy", 80), ("bob", 45), ("cid", 100)];
first_failed(&v)   // Some("bob")
score_range(&v)    // Some((45, 100))
\`\`\``,
    hints: [
      "`v.iter().all(|&(_, s)| s >= 60)`、`v.iter().find(|p| p.1 < 60).map(|p| p.0)`",
      "`let min = v.iter().map(|p| p.1).min()?; let max = v.iter().map(|p| p.1).max()?; Some((min, max))`",
      "`for p in v.iter_mut() { p.1 = (p.1 + bonus).min(100); }`",
    ],
  },
  initialCode: `fn all_passed(v: &[(&str, u32)]) -> bool {
    todo!()
}

fn any_perfect(v: &[(&str, u32)]) -> bool {
    todo!()
}

fn first_failed<'a>(v: &[(&'a str, u32)]) -> Option<&'a str> {
    todo!()
}

fn position_of(v: &[(&str, u32)], name: &str) -> Option<usize> {
    todo!()
}

fn score_range(v: &[(&str, u32)]) -> Option<(u32, u32)> {
    todo!()
}

fn add_bonus(v: &mut Vec<(&str, u32)>, bonus: u32) {
    todo!()
}
`,
  solutionCode: `fn all_passed(v: &[(&str, u32)]) -> bool {
    v.iter().all(|&(_, s)| s >= 60)
}

fn any_perfect(v: &[(&str, u32)]) -> bool {
    v.iter().any(|&(_, s)| s == 100)
}

fn first_failed<'a>(v: &[(&'a str, u32)]) -> Option<&'a str> {
    v.iter().find(|p| p.1 < 60).map(|p| p.0)
}

fn position_of(v: &[(&str, u32)], name: &str) -> Option<usize> {
    v.iter().position(|p| p.0 == name)
}

fn score_range(v: &[(&str, u32)]) -> Option<(u32, u32)> {
    let min = v.iter().map(|p| p.1).min()?;
    let max = v.iter().map(|p| p.1).max()?;
    Some((min, max))
}

fn add_bonus(v: &mut Vec<(&str, u32)>, bonus: u32) {
    for p in v.iter_mut() {
        p.1 = (p.1 + bonus).min(100);
    }
}
`,
});
