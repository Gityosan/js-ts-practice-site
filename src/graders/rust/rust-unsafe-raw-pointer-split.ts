import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "分割して両方を書き換える",
      expr: "{ let mut v = [1, 2, 3, 4, 5]; let (a, b) = my_split_at_mut(&mut v, 2); a[0] = 10; b[0] = 30; (a.to_vec(), b.to_vec()) }",
      expected: "([10, 2], [30, 4, 5])",
    },
    {
      label: "元の配列に反映される",
      expr: "{ let mut v = [1, 2, 3]; { let (a, b) = my_split_at_mut(&mut v, 1); a[0] += b[1]; } v }",
      expected: "[4, 2, 3]",
    },
    {
      label: "mid = 0 と mid = len",
      expr: "{ let mut v = [7, 8]; let l1 = { let (a, b) = my_split_at_mut(&mut v, 0); (a.len(), b.len()) }; let l2 = { let (a, b) = my_split_at_mut(&mut v, 2); (a.len(), b.len()) }; (l1, l2) }",
      expected: "((0, 2), (2, 0))",
    },
    {
      label: "範囲外は panic",
      expr: "std::panic::catch_unwind(|| { let mut v = [1, 2]; let _ = my_split_at_mut(&mut v, 3); }).is_err()",
      expected: "true",
    },
    {
      label: "raw_swap",
      expr: "{ let mut x = 1; let mut y = 2; raw_swap(&raw mut x, &raw mut y); (x, y) }",
      expected: "(2, 1)",
    },
  ],
};

export default grader;
