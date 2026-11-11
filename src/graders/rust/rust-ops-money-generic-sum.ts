import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "足し算と引き算",
      expr: "(Money(300) + Money(200), Money(300) - Money(500))",
      expected: "(Money(500), Money(-200))",
    },
    {
      label: "符号反転と掛け算",
      expr: "(-Money(100), Money(120) * 3)",
      expected: "(Money(-100), Money(360))",
    },
    {
      label: "Money の合計",
      expr: "sum_all(&[Money(100), Money(250), Money(-50)])",
      expected: "Money(300)",
    },
    {
      label: "i32 と f64 の合計",
      expr: "(sum_all(&[1, 2, 3]), sum_all(&[1.5, 2.5]))",
      expected: "(6, 4.0)",
    },
    { label: "空の合計は default", expr: "sum_all::<Money>(&[])", expected: "Money(0)" },
    {
      label: "最安値",
      expr: "(cheapest(&[Money(500), Money(80), Money(120)]), cheapest(&[]))",
      expected: "(Some(Money(80)), None)",
    },
  ],
};

export default grader;
