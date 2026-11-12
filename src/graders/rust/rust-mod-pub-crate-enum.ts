import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "値段",
      expr: '(shop::Order::new("tea", shop::Size::Small).price(), shop::Order::new("tea", shop::Size::Large).price())',
      expected: "(300, 500)",
    },
    {
      label: "サイズアップ",
      expr: '{ let mut o = shop::Order::new("coffee", shop::Size::Small); o.upsize(); (o.size, o.price()) }',
      expected: "(Medium, 400)",
    },
    {
      label: "Large はそのまま",
      expr: '{ let mut o = shop::Order::new("coffee", shop::Size::Large); o.upsize(); (o.size, o.price()) }',
      expected: "(Large, 500)",
    },
    {
      label: "合計（pub(crate)）",
      expr: 'shop::total(&[shop::Order::new("a", shop::Size::Small), shop::Order::new("b", shop::Size::Medium)])',
      expected: "700",
    },
    {
      label: "Debug 表示",
      expr: 'shop::Order::new("tea", shop::Size::Medium)',
      expected: 'Order { item: "tea", size: Medium, price: 400 }',
    },
  ],
};

export default grader;
