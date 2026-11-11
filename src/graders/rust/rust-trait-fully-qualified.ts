import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "3 つの fly",
      expr: "all_flights(&Human)",
      expected: '["機長です", "浮遊！", "腕をばたばた"]',
    },
    { label: "関連関数の呼び分け", expr: "dog_names()", expected: '("ポチ", "子犬")' },
    { label: "関連定数", expr: "sides_total()", expected: "7" },
  ],
};

export default grader;
