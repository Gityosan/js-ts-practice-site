import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "< で比較（major 優先）",
      expr: "Version { major: 1, minor: 0, patch: 0 } > Version { major: 0, minor: 9, patch: 9 }",
      expected: "true",
    },
    {
      label: "ソート",
      expr: "sort_versions(vec![Version { major: 1, minor: 2, patch: 0 }, Version { major: 0, minor: 9, patch: 9 }, Version { major: 1, minor: 0, patch: 5 }]).iter().map(|v| (v.major, v.minor, v.patch)).collect::<Vec<_>>()",
      expected: "[(0, 9, 9), (1, 0, 5), (1, 2, 0)]",
    },
    {
      label: "patch だけ違う",
      expr: "sort_versions(vec![Version { major: 2, minor: 0, patch: 3 }, Version { major: 2, minor: 0, patch: 1 }])",
      expected:
        "[Version { major: 2, minor: 0, patch: 1 }, Version { major: 2, minor: 0, patch: 3 }]",
    },
    {
      label: "newest",
      expr: "newest(&[Version { major: 1, minor: 4, patch: 0 }, Version { major: 1, minor: 10, patch: 0 }, Version { major: 1, minor: 9, patch: 9 }])",
      expected: "Some(Version { major: 1, minor: 10, patch: 0 })",
    },
    { label: "newest（空）", expr: "newest(&[])", expected: "None" },
  ],
};

export default grader;
