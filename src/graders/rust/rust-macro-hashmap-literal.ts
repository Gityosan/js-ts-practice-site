import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "2 件",
      expr: '{ let m = map! { "apple" => 120, "banana" => 80 }; m.into_iter().collect::<std::collections::BTreeMap<_, _>>() }',
      expected: '{"apple": 120, "banana": 80}',
    },
    {
      label: "末尾カンマ",
      expr: '{ let m = map! { 1 => "one", 2 => "two", }; (m.len(), m.get(&2).copied()) }',
      expected: '(2, Some("two"))',
    },
    {
      label: "同じキーは後勝ち",
      expr: '{ let m = map! { "a" => 1, "a" => 2 }; (m.len(), m["a"]) }',
      expected: "(1, 2)",
    },
    {
      label: "空",
      expr: "{ let m: std::collections::HashMap<i32, i32> = map! {}; m.len() }",
      expected: "0",
    },
  ],
};

export default grader;
