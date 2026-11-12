import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "基本", expr: '"3,4".parse::<Point>()', expected: "Ok(Point { x: 3, y: 4 })" },
    {
      label: "空白と負の数",
      expr: '" -1 , 7 ".parse::<Point>()',
      expected: "Ok(Point { x: -1, y: 7 })",
    },
    { label: "カンマなし", expr: '"3".parse::<Point>()', expected: 'Err("no comma")' },
    { label: "数でない", expr: '"a,4".parse::<Point>()', expected: 'Err("bad number")' },
    { label: "y が空", expr: '"5,".parse::<Point>()', expected: 'Err("bad number")' },
    {
      label: "型注釈で parse",
      expr: '{ let p: Point = "10,20".parse().unwrap(); p.x + p.y }',
      expected: "30",
    },
  ],
};

export default grader;
