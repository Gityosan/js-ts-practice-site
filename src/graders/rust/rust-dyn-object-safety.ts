import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "clone_box で複製",
      expr: "{ let s: Box<dyn Shape> = Box::new(Circle { r: 1.5 }); s.clone_box().describe() }",
      expected: '"circle 1.5"',
    },
    {
      label: "全部複製",
      expr: "{ let v: Vec<Box<dyn Shape>> = vec![Box::new(Square { side: 2.0 }), Box::new(Circle { r: 1.0 })]; duplicate_all(&v).iter().map(|s| s.describe()).collect::<Vec<_>>() }",
      expected: '["square 2", "circle 1"]',
    },
    {
      label: "拡大",
      expr: "{ let mut v: Vec<Box<dyn Shape>> = vec![Box::new(Square { side: 2.0 }), Box::new(Circle { r: 1.0 })]; scale_all(&mut v, 3.0); v.iter().map(|s| s.describe()).collect::<Vec<_>>() }",
      expected: '["square 6", "circle 3"]',
    },
    {
      label: "複製は独立している",
      expr: "{ let original: Vec<Box<dyn Shape>> = vec![Box::new(Square { side: 2.0 })]; let mut copies = duplicate_all(&original); scale_all(&mut copies, 3.0); (original[0].describe(), copies[0].describe()) }",
      expected: '("square 2", "square 6")',
    },
  ],
};

export default grader;
