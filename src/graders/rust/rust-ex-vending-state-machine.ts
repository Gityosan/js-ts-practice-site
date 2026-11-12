import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "お金を入れる",
      expr: "step(State::Idle, Event::Insert(100))",
      expected: "Ok(Collecting(100))",
    },
    {
      label: "買えておつりが出る",
      expr: "run(&[Event::Insert(100), Event::Insert(100), Event::Select])",
      expected: "Ok(Sold { change: 50 })",
    },
    {
      label: "受け取って待機に戻る",
      expr: "run(&[Event::Insert(500), Event::Select, Event::Take])",
      expected: "Ok(Idle)",
    },
    {
      label: "お金が足りない",
      expr: "run(&[Event::Insert(100), Event::Select])",
      expected: 'Err("お金が足りません")',
    },
    { label: "キャンセル", expr: "run(&[Event::Insert(10), Event::Cancel])", expected: "Ok(Idle)" },
    {
      label: "できない操作",
      expr: "(step(State::Idle, Event::Select), step(State::Sold { change: 0 }, Event::Insert(10)))",
      expected: '(Err("その操作はできません"), Err("その操作はできません"))',
    },
    { label: "イベントなし", expr: "run(&[])", expected: "Ok(Idle)" },
  ],
};

export default grader;
