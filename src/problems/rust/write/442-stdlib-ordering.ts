import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-stdlib-ordering-then-with",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Ordering と then_with で複数条件の並べ替え",
    prompt: `## やること

\`\`\`rust
#[derive(Debug, Clone)]
struct Player { name: String, score: u32, time: u32 }
\`\`\`

### 1. \`ranking(players: &mut Vec<Player>)\`

次の優先順位で並べ替える。

- \`score\` の **高い順**
- 同点なら \`time\`（クリア時間）の **短い順**
- それも同じなら \`name\` の **辞書順**

### 2. \`compare_version(a: &str, b: &str) -> Ordering\`

\`"1.10.2"\` のようなバージョン文字列を、\`.\` で区切った **数値として** 先頭から比べる（文字列比較だと \`"1.10"\` < \`"1.9"\` になってしまう）。区切りの数が違うときは、足りない部分を 0 とみなす（\`"1.2"\` と \`"1.2.0"\` は \`Equal\`）。

\`\`\`rust
compare_version("1.10.0", "1.9.3") // Greater
compare_version("2.0", "2.0.1")    // Less
\`\`\``,
    hints: [
      "`players.sort_by(|a, b| b.score.cmp(&a.score).then_with(|| a.time.cmp(&b.time)).then_with(|| a.name.cmp(&b.name)))`",
      "`let pa: Vec<u32> = a.split('.').map(|s| s.parse().unwrap()).collect();`",
      "長いほうの長さまで `pa.get(i).copied().unwrap_or(0)` で比べ、`Equal` でなければその結果を返す",
    ],
  },
  initialCode: `use std::cmp::Ordering;

#[derive(Debug, Clone)]
struct Player {
    name: String,
    score: u32,
    time: u32,
}

fn ranking(players: &mut Vec<Player>) {
    todo!()
}

fn compare_version(a: &str, b: &str) -> Ordering {
    todo!()
}
`,
  solutionCode: `use std::cmp::Ordering;

#[derive(Debug, Clone)]
struct Player {
    name: String,
    score: u32,
    time: u32,
}

fn ranking(players: &mut Vec<Player>) {
    players.sort_by(|a, b| {
        b.score
            .cmp(&a.score)
            .then_with(|| a.time.cmp(&b.time))
            .then_with(|| a.name.cmp(&b.name))
    });
}

fn compare_version(a: &str, b: &str) -> Ordering {
    let pa: Vec<u32> = a.split('.').map(|s| s.parse().unwrap()).collect();
    let pb: Vec<u32> = b.split('.').map(|s| s.parse().unwrap()).collect();
    for i in 0..pa.len().max(pb.len()) {
        let x = pa.get(i).copied().unwrap_or(0);
        let y = pb.get(i).copied().unwrap_or(0);
        match x.cmp(&y) {
            Ordering::Equal => continue,
            other => return other,
        }
    }
    Ordering::Equal
}
`,
});
