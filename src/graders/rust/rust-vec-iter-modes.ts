import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "文字数の合計（呼び出し後も使える）",
      expr: '{ let w = vec![String::from("ab"), String::from("cde")]; let n = total_len(&w); (n, w.len()) }',
      expected: "(5, 2)",
    },
    {
      label: "範囲に収める",
      expr: "{ let mut v = vec![-5, 3, 12, 10, 0]; clamp_all(&mut v, 0, 10); v }",
      expected: "[0, 3, 10, 10, 0]",
    },
    {
      label: "大文字に変換",
      expr: 'into_upper(vec![String::from("rust"), String::from("Vec")])',
      expected: '["RUST", "VEC"]',
    },
    {
      label: "2 倍を末尾に追加",
      expr: "{ let mut v = vec![1, 2, 3]; push_doubles(&mut v); v }",
      expected: "[1, 2, 3, 2, 4, 6]",
    },
    {
      label: "空",
      expr: "{ let mut v: Vec<i32> = vec![]; push_doubles(&mut v); (v, into_upper(vec![])) }",
      expected: "([], [])",
    },
  ],
};

export default grader;
