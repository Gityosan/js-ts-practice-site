import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-manual-ord",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Ord を手で実装して独自の並び順にする",
    prompt: `## やること

ゲームのランキング用に \`Player { name, score }\` を並べたい。並び順は:

- **スコアの高い順**（降順）
- 同点なら **名前のアルファベット順**（昇順）

derive の Ord では「name → score の昇順」になってしまうので、\`Ord\` を **手で実装** しよう。

\`\`\`rust
impl Ord for Player {
    fn cmp(&self, other: &Self) -> Ordering { ... }
}
impl PartialOrd for Player {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> { Some(self.cmp(other)) }
}
\`\`\`

その上で \`ranking(players: Vec<Player>) -> Vec<String>\` を書く。\`sort()\` して名前だけの Vec を返す。

\`\`\`rust
ranking(vec![p("bob", 50), p("amy", 80), p("cat", 50)])  // ["amy", "bob", "cat"]
\`\`\`

- \`a.cmp(&b)\` は \`Ordering::Less / Equal / Greater\` を返す
- **降順** にしたいときは \`other.score.cmp(&self.score)\` のように左右を入れ替える
- \`ord1.then_with(|| ord2)\` … ord1 が Equal のときだけ ord2 で決める`,
    hints: [
      "`other.score.cmp(&self.score).then_with(|| self.name.cmp(&other.name))`",
      "PartialEq / Eq は derive のままでよい",
      "ranking は `let mut v = players; v.sort(); v.into_iter().map(|p| p.name).collect()`（for で push してもよい）",
    ],
  },
  initialCode: `use std::cmp::Ordering;

#[derive(Debug, PartialEq, Eq)]
struct Player {
    name: String,
    score: u32,
}

impl Ord for Player {
    fn cmp(&self, other: &Self) -> Ordering {
        todo!()
    }
}

impl PartialOrd for Player {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn ranking(players: Vec<Player>) -> Vec<String> {
    todo!()
}
`,
  solutionCode: `use std::cmp::Ordering;

#[derive(Debug, PartialEq, Eq)]
struct Player {
    name: String,
    score: u32,
}

impl Ord for Player {
    fn cmp(&self, other: &Self) -> Ordering {
        other
            .score
            .cmp(&self.score)
            .then_with(|| self.name.cmp(&other.name))
    }
}

impl PartialOrd for Player {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn ranking(players: Vec<Player>) -> Vec<String> {
    let mut v = players;
    v.sort();
    let mut names = Vec::new();
    for p in v {
        names.push(p.name);
    }
    names
}
`,
});
