import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "姓 名", expr: 'full_name("Taro", "Yamada")', expected: '"Yamada Taro"' },
    { label: "日本語", expr: 'full_name("花子", "佐藤")', expected: '"佐藤 花子"' },
    {
      label: "リスト",
      expr: 'build_list(&["apple", "banana"])',
      expected: '"- apple\\n- banana\\n"',
    },
    { label: "1 要素", expr: 'build_list(&["x"])', expected: '"- x\\n"' },
    { label: "空", expr: "build_list(&[])", expected: '""' },
  ],
};

export default grader;
