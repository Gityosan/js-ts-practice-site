import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "3 個付ける", expr: 'exclaim(String::from("hello"), 3)', expected: '"hello!!!"' },
    { label: "0 個なら変わらない", expr: 'exclaim(String::from("ok"), 0)', expected: '"ok"' },
    { label: "空文字に付ける", expr: "exclaim(String::new(), 2)", expected: '"!!"' },
    { label: "日本語", expr: 'exclaim(String::from("すごい"), 1)', expected: '"すごい!"' },
  ],
};

export default grader;
