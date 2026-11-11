import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "stdout",
  cases: [{ label: "Hello, Rust! と表示", expected: "Hello, Rust!" }],
};

export default grader;
