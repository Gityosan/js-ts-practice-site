import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "正しい形式", expr: 'parse_person("alice:30")', expected: 'Some(("alice", 30))' },
    { label: ": がない", expr: 'parse_person("bob")', expected: "None" },
    { label: "年齢が数値でない", expr: 'parse_person("bob:abc")', expected: "None" },
    { label: "名前が空", expr: 'parse_person(":20")', expected: "None" },
    {
      label: "挨拶（成功）",
      expr: 'greet("alice:30")',
      expected: '"こんにちは、alice さん（30 歳）"',
    },
    { label: "挨拶（失敗）", expr: 'greet("x:-1")', expected: '"不正な入力"' },
  ],
};

export default grader;
