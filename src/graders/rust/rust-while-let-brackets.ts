import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "入れ子が正しい", expr: 'balanced("{[()]}")', expected: "true" },
    { label: "交差している", expr: 'balanced("([)]")', expected: "false" },
    { label: "閉じ忘れ", expr: 'balanced("((")', expected: "false" },
    { label: "いきなり閉じる", expr: 'balanced(")(")', expected: "false" },
    {
      label: "括弧以外は無視・空文字列",
      expr: '(balanced("fn f(x: [i32; 2]) { }"), balanced(""))',
      expected: "(true, true)",
    },
    {
      label: "スタックを全部取り出す",
      expr: "(drain_stack(vec![1, 2, 3]), drain_stack(vec![]))",
      expected: "([3, 2, 1], [])",
    },
  ],
};

export default grader;
