import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "折り返し", expr: "add_wrap(250, 10)", expected: "4" },
    { label: "あふれないときはそのまま", expr: "add_wrap(1, 2)", expected: "3" },
    { label: "checked: あふれたら None", expr: "add_checked(250, 10)", expected: "None" },
    { label: "checked: ちょうど 255", expr: "add_checked(200, 55)", expected: "Some(255)" },
    { label: "saturating: 0 に張り付く", expr: "sub_saturate(3, 10)", expected: "0" },
    { label: "saturating: 普通の引き算", expr: "sub_saturate(10, 3)", expected: "7" },
  ],
};

export default grader;
