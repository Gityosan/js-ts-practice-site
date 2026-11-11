import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "500 円", expr: "value(&Coin::FiveHundred)", expected: "500" },
    { label: "記念硬貨", expr: "value(&Coin::Commemorative(1000))", expected: "1000" },
    {
      label: "全種類の合計",
      expr: "total(&[Coin::One, Coin::Five, Coin::Ten, Coin::Fifty, Coin::Hundred, Coin::FiveHundred])",
      expected: "666",
    },
    { label: "空なら 0", expr: "total(&[])", expected: "0" },
    {
      label: "穴あき硬貨",
      expr: "[Coin::Five, Coin::Fifty, Coin::Ten, Coin::Commemorative(5)].iter().map(is_hole).collect::<Vec<_>>()",
      expected: "[true, true, false, false]",
    },
  ],
};

export default grader;
