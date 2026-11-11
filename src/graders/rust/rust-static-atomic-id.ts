import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "最初の ID は 1", expr: "next_id()", expected: "1" },
    {
      label: "呼ぶたびに 1 増える",
      expr: "{ let a = next_id(); let b = next_id(); let c = next_id(); (b - a, c - b) }",
      expected: "(1, 1)",
    },
    {
      label: "複数スレッドでも重複しない",
      expr: "{ let hs: Vec<_> = (0..8).map(|_| std::thread::spawn(next_id)).collect(); let mut ids: Vec<u32> = hs.into_iter().map(|h| h.join().unwrap()).collect(); ids.sort(); ids.dedup(); ids.len() }",
      expected: "8",
    },
    {
      label: "曜日名",
      expr: "(weekday_name(0), weekday_name(3), weekday_name(6))",
      expected: '("日", "水", "土")',
    },
    { label: "範囲外", expr: "weekday_name(7)", expected: '"?"' },
    {
      label: "履歴を static に記録",
      expr: '{ let a = record("start"); let b = record("next"); b - a }',
      expected: "1",
    },
  ],
};

export default grader;
