import type { CliGraderDef } from "../../grade/types";

// ${var:-default} で未入力時のデフォルト値を扱えているか確認する。
const grader: CliGraderDef = {
  kind: "cli",
  runtime: "sh",
  cases: [
    {
      label: "名前あり",
      stdin: "Aki\n",
      expected: "Hello, Aki!",
    },
    {
      label: "名前なし",
      stdin: "",
      expected: "Hello, Guest!",
    },
  ],
};

export default grader;
