import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "値段を取得", expr: 'block_on(fetch_price("melon"))', expected: "Some(1500)" },
    { label: "無い商品", expr: 'block_on(fetch_price("grape"))', expected: "None" },
    {
      label: "合計",
      expr: 'block_on(total(vec!["apple", "banana", "apple"]))',
      expected: "Some(320)",
    },
    { label: "空の合計", expr: "block_on(total(vec![]))", expected: "Some(0)" },
    {
      label: "1 つでも不明なら None",
      expr: 'block_on(total(vec!["apple", "grape"]))',
      expected: "None",
    },
    {
      label: "文章にする",
      expr: 'block_on(total_text(vec!["melon"]))',
      expected: '"合計 1500 円"',
    },
    {
      label: "文章（不明）",
      expr: 'block_on(total_text(vec!["?"]))',
      expected: '"不明な商品があります"',
    },
  ],
};

export default grader;
