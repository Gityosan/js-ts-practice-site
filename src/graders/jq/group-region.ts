import type { CliGraderDef } from "../../grade/types";

const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "east/west",
      stdin: {
        sales: [
          { region: "east", amt: 10 },
          { region: "west", amt: 5 },
          { region: "east", amt: 3 },
        ],
      },
      args: ["-c"],
      expected: '[{"region":"east","total":13},{"region":"west","total":5}]',
    },
    {
      label: "1地域",
      stdin: { sales: [{ region: "n", amt: 7 }] },
      args: ["-c"],
      expected: '[{"region":"n","total":7}]',
    },
  ],
};

export default grader;
