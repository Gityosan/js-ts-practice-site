import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "作る", expr: "Length::<Cm>::new(3).value", expected: "3" },
    {
      label: "同じ単位を足す",
      expr: "(Length::<Cm>::new(3) + Length::<Cm>::new(4)).value",
      expected: "7",
    },
    { label: "cm → mm", expr: "to_mm(Length::new(3)).value", expected: "30" },
    {
      label: "合計を mm で",
      expr: "total_mm(&[Length::new(3), Length::new(1)], &[Length::new(5)])",
      expected: "45",
    },
    {
      label: "PhantomData はサイズ 0",
      expr: "std::mem::size_of::<Length<Cm>>() == std::mem::size_of::<i64>()",
      expected: "true",
    },
  ],
};

export default grader;
