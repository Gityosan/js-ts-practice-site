import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "直接ログを書く",
      expr: '{ let l = MockLogger::new(); l.log("a"); l.log("b"); l.messages() }',
      expected: '["a", "b"]',
    },
    { label: "新品は空", expr: "MockLogger::new().messages().len()", expected: "0" },
    {
      label: "process の戻り値",
      expr: "{ let l = MockLogger::new(); process(&[3, -1, 4], &l) }",
      expected: "7",
    },
    {
      label: "process のログ",
      expr: "{ let l = MockLogger::new(); process(&[3, -1, 4, -5, 0], &l); l.messages() }",
      expected: '["skip -1", "skip -5", "sum 7"]',
    },
    {
      label: "空の入力",
      expr: "{ let l = MockLogger::new(); let s = process(&[], &l); (s, l.messages()) }",
      expected: '(0, ["sum 0"])',
    },
  ],
};

export default grader;
