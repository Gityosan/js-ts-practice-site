import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "adder", expr: "adder(5)(10)", expected: "15" },
    { label: "multiplier", expr: "multiplier(-3)(4)", expected: "-12" },
    { label: "順に適用", expr: "compose_all(&[adder(1), multiplier(10)], 3)", expected: "40" },
    { label: "空なら入力のまま", expr: "compose_all(&[], 7)", expected: "7" },
    { label: "文字列から組み立てる", expr: 'compose_all(&build("+3 *2 +1"), 1)', expected: "9" },
    { label: "組み立てた個数", expr: 'build("*2 *2 *2 +-1").len()', expected: "4" },
  ],
};

export default grader;
