import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "既定値で作る",
      expr: 'default_config(String::from("p1"))',
      expected: 'Config { name: "p1", volume: 50, fullscreen: false, difficulty: 1 }',
    },
    {
      label: "hard_mode に変える",
      expr: 'hard_mode(default_config(String::from("p1")))',
      expected: 'Config { name: "p1", volume: 50, fullscreen: true, difficulty: 3 }',
    },
    {
      label: "他のフィールドは引き継ぐ",
      expr: 'hard_mode(Config { name: String::from("x"), volume: 9, fullscreen: false, difficulty: 2 })',
      expected: 'Config { name: "x", volume: 9, fullscreen: true, difficulty: 3 }',
    },
  ],
};

export default grader;
