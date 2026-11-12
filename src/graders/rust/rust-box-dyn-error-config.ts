import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "設定を読む",
      expr: 'parse_config("width=80\\n\\nheight = 24\\n").map_err(|e| e.to_string())',
      expected: 'Ok({"height": 24, "width": 80})',
    },
    {
      label: "= がない行",
      expr: 'parse_config("a=1\\nb=2\\noops").map_err(|e| e.to_string())',
      expected: "Err(\"3 行目: '=' がありません\")",
    },
    {
      label: "数値でない値は ParseIntError のメッセージ",
      expr: 'parse_config("a=x").map_err(|e| e.to_string())',
      expected: 'Err("invalid digit found in string")',
    },
    {
      label: "面積",
      expr: 'get_area("height=24\\nwidth=80").map_err(|e| e.to_string())',
      expected: "Ok(1920)",
    },
    {
      label: "キーがない",
      expr: '(get_area("width=3").map_err(|e| e.to_string()), get_area("").map_err(|e| e.to_string()))',
      expected: '(Err("height がありません"), Err("width がありません"))',
    },
  ],
};

export default grader;
