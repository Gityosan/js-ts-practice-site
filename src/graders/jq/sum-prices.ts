import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "3品",
      stdin: {
        items: [
          { name: "pen", price: 120 },
          { name: "note", price: 300 },
          { name: "eraser", price: 80 },
        ],
      },
      expected: "500",
    },
    {
      label: "1品",
      stdin: { items: [{ name: "a", price: 50 }] },
      expected: "50",
    },
  ],
};

export default grader;
