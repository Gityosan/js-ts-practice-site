import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "入荷は足し算",
      expr: '{ let mut inv = Inventory::new(); inv.add("pen", 5); inv.add("pen", 3); inv.quantity("pen") }',
      expected: "8",
    },
    {
      label: "出荷して残りを返す",
      expr: '{ let mut inv = Inventory::new(); inv.add("pen", 5); inv.remove("pen", 2) }',
      expected: "Ok(3)",
    },
    {
      label: "0 になったら削除",
      expr: '{ let mut inv = Inventory::new(); inv.add("pen", 2); let r = inv.remove("pen", 2); (r, inv.report()) }',
      expected: "(Ok(0), [])",
    },
    {
      label: "無い商品",
      expr: '{ let mut inv = Inventory::new(); inv.remove("ink", 1) }',
      expected: 'Err(NotFound("ink"))',
    },
    {
      label: "在庫不足では減らない",
      expr: '{ let mut inv = Inventory::new(); inv.add("pen", 1); let r = inv.remove("pen", 4); (r, inv.quantity("pen")) }',
      expected: '(Err(OutOfStock { name: "pen", requested: 4, available: 1 }), 1)',
    },
    {
      label: "一覧は名前順",
      expr: '{ let mut inv = Inventory::new(); inv.add("note", 2); inv.add("eraser", 7); inv.add("pen", 1); inv.report() }',
      expected: '["eraser: 7", "note: 2", "pen: 1"]',
    },
  ],
};

export default grader;
