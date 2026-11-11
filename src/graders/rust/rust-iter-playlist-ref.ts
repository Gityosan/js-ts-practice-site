import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "for で借用して回す",
      expr: '{ let p = Playlist::new(vec!["Intro", "Song", "Outro"]); let mut total = 0; for s in &p { total += s.len(); } (total, p.len()) }',
      expected: "(14, 3)",
    },
    {
      label: "番号付き",
      expr: 'titles_with_numbers(&Playlist::new(vec!["Intro", "Song"]))',
      expected: '["1: Intro", "2: Song"]',
    },
    { label: "空", expr: "titles_with_numbers(&Playlist::new(vec![]))", expected: "[]" },
    {
      label: "アダプタも使える",
      expr: '{ let p = Playlist::new(vec!["a", "bbb", "cc"]); (&p).into_iter().map(|s| s.len()).max() }',
      expected: "Some(3)",
    },
  ],
};

export default grader;
