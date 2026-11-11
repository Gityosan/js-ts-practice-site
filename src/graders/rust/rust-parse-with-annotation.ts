import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "基本", expr: 'add_strs("12", "30")', expected: "42" },
    { label: "負の数", expr: 'add_strs("-5", "5")', expected: "0" },
    { label: "i32 を超える大きさ", expr: 'add_strs("3000000000", "1")', expected: "3000000001" },
    { label: "0 同士", expr: 'add_strs("0", "0")', expected: "0" },
  ],
};

export default grader;
