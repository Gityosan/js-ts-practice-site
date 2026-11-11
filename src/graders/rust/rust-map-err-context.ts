import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "1 行を読む", expr: 'parse_order(1, "pen, 2, 100")', expected: 'Ok(("pen", 2, 100))' },
    {
      label: "項目数エラー",
      expr: 'parse_order(4, "pen,2")',
      expected: 'Err(OrderError { line: 4, msg: "項目数が 3 ではありません" })',
    },
    {
      label: "単価エラー",
      expr: 'parse_order(1, "pen,2,abc")',
      expected: "Err(OrderError { line: 1, msg: \"単価 'abc' を読めません\" })",
    },
    {
      label: "合計（空行は飛ばす）",
      expr: '(total("pen,2,100\\n\\ncup,1,350"), total(""))',
      expected: "(Ok(550), Ok(0))",
    },
    {
      label: "途中の行のエラー",
      expr: 'total("pen,2,100\\ncup,x,350\\nbad")',
      expected: "Err(OrderError { line: 2, msg: \"個数 'x' を読めません\" })",
    },
    {
      label: "Display",
      expr: 'total("a,1,1\\nb,abc,1").unwrap_err().to_string()',
      expected: "\"2 行目: 個数 'abc' を読めません\"",
    },
  ],
};

export default grader;
