import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "3 回待つ",
      expr: "run_counting(Countdown { remaining: 3, waited: 0 })",
      expected: '("3回待った", 4)',
    },
    {
      label: "すぐ完了",
      expr: "run_counting(Countdown { remaining: 0, waited: 0 })",
      expected: '("0回待った", 1)',
    },
    {
      label: "await で使う",
      expr: 'run_counting(async { let a = Countdown { remaining: 1, waited: 0 }.await; let b = Countdown { remaining: 2, waited: 0 }.await; format!("{a}/{b}") })',
      expected: '("1回待った/2回待った", 4)',
    },
  ],
};

export default grader;
