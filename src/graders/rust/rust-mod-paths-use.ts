import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "crate::SCALE を使う", expr: "units::length::to_mm(3)", expected: "30" },
    { label: "pub use で再公開", expr: "units::cm_to_mm(-2)", expected: "-20" },
    { label: "super で兄弟モジュールへ", expr: "units::area::square_mm(2)", expected: "400" },
    { label: "use ... as の別名", expr: "sq_mm(1)", expected: "100" },
  ],
};

export default grader;
