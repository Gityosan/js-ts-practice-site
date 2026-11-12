import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "SECONDS_PER_MINUTE は 60", expr: "SECONDS_PER_MINUTE", expected: "60" },
    { label: "SECONDS_PER_HOUR は 3600", expr: "SECONDS_PER_HOUR", expected: "3600" },
    { label: "1 時間", expr: "to_seconds(1, 0, 0)", expected: "3600" },
    { label: "2 分 5 秒", expr: "to_seconds(0, 2, 5)", expected: "125" },
    { label: "1 時間 1 分 1 秒", expr: "to_seconds(1, 1, 1)", expected: "3661" },
    { label: "0 秒", expr: "to_seconds(0, 0, 0)", expected: "0" },
  ],
};

export default grader;
