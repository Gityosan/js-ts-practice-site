import type { CliGraderDef } from "../../grade/types";

// ドットを連ねてネストしたフィールドを取得できているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "jq",
  cases: [
    {
      label: "Tokyo",
      stdin: {
        company: {
          name: "Acme",
          address: {
            city: "Tokyo",
          },
        },
      },
      args: ["-r"],
      expected: "Tokyo",
    },
    {
      label: "Osaka",
      stdin: {
        company: {
          name: "X",
          address: {
            city: "Osaka",
          },
        },
      },
      args: ["-r"],
      expected: "Osaka",
    },
  ],
};

export default grader;
