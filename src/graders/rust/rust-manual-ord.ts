import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "スコア降順",
      expr: 'Player { name: "a".to_string(), score: 90 } < Player { name: "b".to_string(), score: 10 }',
      expected: "true",
    },
    {
      label: "同点は名前昇順",
      expr: 'Player { name: "amy".to_string(), score: 5 }.cmp(&Player { name: "bob".to_string(), score: 5 })',
      expected: "Less",
    },
    {
      label: "ランキング",
      expr: 'ranking(vec![Player { name: "bob".to_string(), score: 50 }, Player { name: "amy".to_string(), score: 80 }, Player { name: "cat".to_string(), score: 50 }])',
      expected: '["amy", "bob", "cat"]',
    },
    {
      label: "同点が複数",
      expr: 'ranking(vec![Player { name: "z".to_string(), score: 1 }, Player { name: "y".to_string(), score: 1 }, Player { name: "x".to_string(), score: 2 }])',
      expected: '["x", "y", "z"]',
    },
    { label: "空", expr: "ranking(vec![])", expected: "[]" },
  ],
};

export default grader;
