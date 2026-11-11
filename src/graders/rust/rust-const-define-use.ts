import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "定数の値",
      expr: "(MAX_LEVEL, EXP_PER_LEVEL, MAX_EXP, TITLE)",
      expected: '(99, 250, 24750, "Rust Quest")',
    },
    { label: "経験値 0 はレベル 1", expr: "level_of(0)", expected: "1" },
    { label: "経験値 500 はレベル 3", expr: "level_of(500)", expected: "3" },
    { label: "上限で止まる", expr: "level_of(MAX_EXP * 2)", expected: "99" },
    { label: "バナー", expr: "banner()", expected: '"Rust Quest (Lv.1-99)"' },
  ],
};

export default grader;
