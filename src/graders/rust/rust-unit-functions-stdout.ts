import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "stdout",
  cases: [{ label: "4 行の出力", expected: "Hello, Alice!\nHello, Bob!\n2 + 3 = 5\n-1 + 10 = 9" }],
};

export default grader;
