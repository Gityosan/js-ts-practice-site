import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "点数 → 時間 → 名前",
      expr: '{ let mut v = vec![Player { name: "cat".into(), score: 80, time: 50 }, Player { name: "ant".into(), score: 90, time: 70 }, Player { name: "bee".into(), score: 80, time: 40 }, Player { name: "ape".into(), score: 80, time: 50 }]; ranking(&mut v); v.into_iter().map(|p| p.name).collect::<Vec<_>>() }',
      expected: '["ant", "bee", "ape", "cat"]',
    },
    {
      label: "空でも動く",
      expr: "{ let mut v: Vec<Player> = vec![]; ranking(&mut v); v.len() }",
      expected: "0",
    },
    { label: "1.10 > 1.9", expr: 'compare_version("1.10.0", "1.9.3")', expected: "Greater" },
    { label: "足りない部分は 0", expr: 'compare_version("1.2", "1.2.0")', expected: "Equal" },
    { label: "2.0 < 2.0.1", expr: 'compare_version("2.0", "2.0.1")', expected: "Less" },
  ],
};

export default grader;
