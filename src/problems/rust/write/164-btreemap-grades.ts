import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-btreemap-ranking",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "BTreeMap で順序付きの成績表",
    prompt: `## やること

生徒の点数 \`(名前, 点数)\` のリストから成績表を作る。

- \`best_scores(records: &[(&str, u32)]) -> BTreeMap<String, u32>\` … 同じ生徒が複数回出てきたら **最高点** を残す。名前順に並ぶよう BTreeMap で返す
- \`by_grade(records: &[(&str, u32)]) -> BTreeMap<char, Vec<String>>\` … \`best_scores\` の結果をもとに、80 以上 \`'A'\`、60 以上 \`'B'\`、それ未満 \`'C'\` に分ける。各リストは名前順
- \`ranking(records: &[(&str, u32)]) -> Vec<(String, u32)>\` … 最高点の **高い順**、同点なら名前順

\`\`\`rust
let r = [("bob", 70), ("amy", 90), ("bob", 85), ("cat", 40)];
best_scores(&r);  // {"amy": 90, "bob": 85, "cat": 40}
by_grade(&r);     // {'A': ["amy", "bob"], 'C': ["cat"]}
ranking(&r);      // [("amy", 90), ("bob", 85), ("cat", 40)]
\`\`\`

- 最高点の更新: \`let e = map.entry(name.to_string()).or_insert(score); if score > *e { *e = score; }\`（または \`*e = (*e).max(score)\`）
- BTreeMap を名前順に回せば、push するだけで各グループも名前順になる`,
    hints: [
      "`let e = map.entry(name.to_string()).or_insert(0); *e = (*e).max(score);`",
      "by_grade: `for (name, s) in best_scores(records) { let g = if s >= 80 { 'A' } else if s >= 60 { 'B' } else { 'C' }; out.entry(g).or_default().push(name); }`",
      "ranking: `v.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(&b.0)));`",
    ],
  },
  initialCode: `use std::collections::BTreeMap;

fn best_scores(records: &[(&str, u32)]) -> BTreeMap<String, u32> {
    todo!()
}

fn by_grade(records: &[(&str, u32)]) -> BTreeMap<char, Vec<String>> {
    todo!()
}

fn ranking(records: &[(&str, u32)]) -> Vec<(String, u32)> {
    todo!()
}
`,
  solutionCode: `use std::collections::BTreeMap;

fn best_scores(records: &[(&str, u32)]) -> BTreeMap<String, u32> {
    let mut map = BTreeMap::new();
    for &(name, score) in records {
        let e = map.entry(name.to_string()).or_insert(score);
        if score > *e {
            *e = score;
        }
    }
    map
}

fn by_grade(records: &[(&str, u32)]) -> BTreeMap<char, Vec<String>> {
    let mut out: BTreeMap<char, Vec<String>> = BTreeMap::new();
    for (name, s) in best_scores(records) {
        let g = if s >= 80 {
            'A'
        } else if s >= 60 {
            'B'
        } else {
            'C'
        };
        out.entry(g).or_default().push(name);
    }
    out
}

fn ranking(records: &[(&str, u32)]) -> Vec<(String, u32)> {
    let mut v: Vec<(String, u32)> = best_scores(records).into_iter().collect();
    v.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(&b.0)));
    v
}
`,
});
