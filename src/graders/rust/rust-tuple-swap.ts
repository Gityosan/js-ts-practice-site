import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "入れ替え", expr: "swap((7, true))", expected: "(true, 7)" },
    { label: "入れ替え（負・false）", expr: "swap((-1, false))", expected: "(false, -1)" },
    { label: "和", expr: "pair_sum((3, 4))", expected: "7" },
    { label: "負の数を含む和", expr: "pair_sum((-10, 4))", expected: "-6" },
  ],
};

export default grader;
