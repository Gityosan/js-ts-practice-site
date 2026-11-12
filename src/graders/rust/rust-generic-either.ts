import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "is_left（Left）",
      expr: "{ let e: Either<i32, &str> = Either::Left(3); e.is_left() }",
      expected: "true",
    },
    {
      label: "is_left（Right）",
      expr: '{ let e: Either<i32, &str> = Either::Right("x"); e.is_left() }',
      expected: "false",
    },
    {
      label: "left（Left）",
      expr: "{ let e: Either<i32, &str> = Either::Left(3); e.left() }",
      expected: "Some(3)",
    },
    {
      label: "left（Right）",
      expr: '{ let e: Either<i32, &str> = Either::Right("x"); e.left() }',
      expected: "None",
    },
    {
      label: "flip",
      expr: "{ let e: Either<i32, &str> = Either::Left(3); e.flip() }",
      expected: "Right(3)",
    },
    {
      label: "flip の flip",
      expr: '{ let e: Either<i32, &str> = Either::Right("x"); e.flip().flip() }',
      expected: 'Right("x")',
    },
  ],
};

export default grader;
