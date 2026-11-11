import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "stdout",
  cases: [
    { label: "一覧と合計を表示", expected: "apple: 120円\nmilk: 210円\nbread: 120円\n合計: 450円" },
  ],
};

export default grader;
