import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "全部成功", expr: 'parse_all(&["1", "2", "3"])', expected: "Ok([1, 2, 3])" },
    { label: "最初の失敗", expr: 'parse_all(&["1", "x", "y"])', expected: 'Err("bad: x")' },
    { label: "空は Ok", expr: "parse_all(&[])", expected: "Ok([])" },
    {
      label: "sum_all",
      expr: '(sum_all(&["10", "-3"]), sum_all(&["1", "?"]))',
      expected: '(Ok(7), Err("bad: ?"))',
    },
    {
      label: "all_present",
      expr: "(all_present(&[Some(1), Some(2)]), all_present(&[Some(1), None]))",
      expected: "(Some([1, 2]), None)",
    },
    { label: "split_valid", expr: 'split_valid(&["1", "x", "3", ""])', expected: "([1, 3], 2)" },
  ],
};

export default grader;
