import type { CliGraderDef } from "../../grade/types";

// 3/5/15 の倍数判定の優先順位を含めて FizzBuzz が正しいか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "1..15",
      stdin: "",
      expected: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
    },
  ],
};

export default grader;
