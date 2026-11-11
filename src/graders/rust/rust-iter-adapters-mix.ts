import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "filter_map",
      expr: 'parse_valid(&["1", "x", "3", "-4", " 5"])',
      expected: "[1, 3, -4]",
    },
    { label: "fold", expr: "(product(&[2, 3, 4]), product(&[]))", expected: "(24, 1)" },
    { label: "flat_map", expr: 'all_chars(&["ab", "", "c"])', expected: "['a', 'b', 'c']" },
    {
      label: "take_while",
      expr: "(sum_until_negative(&[3, 4, -1, 10]), sum_until_negative(&[-1, 5]), sum_until_negative(&[1, 2]))",
      expected: "(7, 0, 3)",
    },
    {
      label: "skip と take",
      expr: "(middle(&[1, 2, 3, 4]), middle(&[1, 2]), middle(&[]))",
      expected: "([2, 3], [], [])",
    },
    { label: "chain と rev", expr: "joined_rev(&[1, 2], &[3])", expected: "[3, 2, 1]" },
  ],
};

export default grader;
