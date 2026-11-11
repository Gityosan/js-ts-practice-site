import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "stdout",
  cases: [
    {
      label: "4 行の表示",
      expected: '名前: Ferris\n年齢: 7 歳\n好きな言語: ["Rust", "C"]\nFerris は来年 8 歳になる',
    },
  ],
};

export default grader;
