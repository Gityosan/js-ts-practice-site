import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "stdout",
  cases: [
    {
      label: "表の表示",
      expected:
        "  No|商品        |      価格\n 001|apple     |  120.00\n 002|banana    |   80.50\n 010|melon     | 1500.00\n--------------------------\n  合計: 1700.50",
    },
  ],
};

export default grader;
