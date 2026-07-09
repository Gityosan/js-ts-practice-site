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
      args: ["-r"],
      expected: "note",
    },
    {
      label: "1品",
      stdin: { items: [{ name: "solo", price: 9 }] },
      args: ["-r"],
      expected: "solo",
    },
  ],
};

export default grader;
