import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "年齢の昇順",
      expr: 'by_age(vec![("Bob".to_string(), 30), ("Amy".to_string(), 17), ("Cid".to_string(), 45)])',
      expected: '["Amy", "Bob", "Cid"]',
    },
    {
      label: "同じ年齢は元の順",
      expr: 'by_age(vec![("X".to_string(), 5), ("Y".to_string(), 1), ("Z".to_string(), 5)])',
      expected: '["Y", "X", "Z"]',
    },
    {
      label: "名前の長い順",
      expr: 'by_name_len_desc(vec![("Al".to_string(), 1), ("Barbara".to_string(), 2), ("Cid".to_string(), 3), ("Do".to_string(), 4)])',
      expected: '["Barbara", "Cid", "Al", "Do"]',
    },
    {
      label: "一番年上",
      expr: 'oldest(&[("Bob".to_string(), 30), ("Cid".to_string(), 45), ("Amy".to_string(), 17)])',
      expected: 'Some("Cid")',
    },
    { label: "一番年上（空）", expr: "oldest(&[])", expected: "None" },
    {
      label: "20 歳以上",
      expr: 'adults(vec![("Bob".to_string(), 30), ("Amy".to_string(), 17), ("Cid".to_string(), 20)])',
      expected: '["Bob", "Cid"]',
    },
  ],
};

export default grader;
