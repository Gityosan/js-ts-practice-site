import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "最高点を残す",
      expr: 'best_scores(&[("bob", 70), ("amy", 90), ("bob", 85), ("cat", 40)])',
      expected: '{"amy": 90, "bob": 85, "cat": 40}',
    },
    {
      label: "後から低い点が来ても下がらない",
      expr: 'best_scores(&[("x", 50), ("x", 20)])',
      expected: '{"x": 50}',
    },
    {
      label: "成績で分ける",
      expr: 'by_grade(&[("bob", 70), ("amy", 90), ("bob", 85), ("cat", 40), ("dan", 60)])',
      expected: '{\'A\': ["amy", "bob"], \'B\': ["dan"], \'C\': ["cat"]}',
    },
    {
      label: "ランキング（同点は名前順）",
      expr: 'ranking(&[("eve", 80), ("bob", 95), ("al", 80)])',
      expected: '[("bob", 95), ("al", 80), ("eve", 80)]',
    },
    {
      label: "空",
      expr: "(best_scores(&[]), by_grade(&[]), ranking(&[]))",
      expected: "({}, {}, [])",
    },
  ],
};

export default grader;
