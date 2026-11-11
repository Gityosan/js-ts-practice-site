import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-derive-ord-sort",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "derive した Ord で構造体をソートする",
    prompt: `## やること

バージョン番号 \`Version { major, minor, patch }\` に比較系のトレイトを derive して、ソートや最大値を求めよう。

- （1）\`Version\` に \`Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord\` を derive する
- （2）\`sort_versions(v: Vec<Version>) -> Vec<Version>\` … 古い順に並べて返す
- （3）\`newest(v: &[Version]) -> Option<Version>\` … 一番新しいもの（空なら \`None\`）

derive した比較は **フィールドを上から順に** 比べる（major → minor → patch）。だからフィールドの定義順がそのまま優先順位になる。

\`\`\`rust
sort_versions(vec![v(1, 2, 0), v(0, 9, 9), v(1, 0, 5)])
// [0.9.9, 1.0.5, 1.2.0]
\`\`\`

（採点では \`Version { major: 1, minor: 2, patch: 0 }\` のように書く）`,
    hints: [
      "`let mut v = v; v.sort(); v` でソートして返す",
      "newest は `v.iter().max().copied()`（Ord があるので max が使える）",
      "`iter().max()` は `Option<&Version>` を返す。`.copied()` で `Option<Version>` に",
    ],
  },
  initialCode: `// 必要な derive を足そう
#[derive(Debug)]
struct Version {
    major: u32,
    minor: u32,
    patch: u32,
}

fn sort_versions(v: Vec<Version>) -> Vec<Version> {
    todo!()
}

fn newest(v: &[Version]) -> Option<Version> {
    todo!()
}
`,
  solutionCode: `#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
struct Version {
    major: u32,
    minor: u32,
    patch: u32,
}

fn sort_versions(v: Vec<Version>) -> Vec<Version> {
    let mut v = v;
    v.sort();
    v
}

fn newest(v: &[Version]) -> Option<Version> {
    v.iter().max().copied()
}
`,
});
