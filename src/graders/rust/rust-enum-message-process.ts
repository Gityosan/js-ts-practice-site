import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "左回り",
      expr: "[Dir::North.left(), Dir::West.left(), Dir::South.left(), Dir::East.left()]",
      expected: "[West, South, East, North]",
    },
    { label: "右回り", expr: "[Dir::North.right(), Dir::East.right()]", expected: "[East, South]" },
    {
      label: "前進と右折",
      expr: "{ let mut r = Robot { x: 0, y: 0, dir: Dir::North }; r.apply(&Command::Forward(3)); r.apply(&Command::TurnRight); r.apply(&Command::Forward(2)); r }",
      expected: "Robot { x: 2, y: 3, dir: East }",
    },
    {
      label: "後ろ向きに進む",
      expr: "{ let mut r = Robot { x: 0, y: 0, dir: Dir::North }; r.apply(&Command::TurnLeft); r.apply(&Command::TurnLeft); r.apply(&Command::Forward(4)); r }",
      expected: "Robot { x: 0, y: -4, dir: South }",
    },
    {
      label: "瞬間移動",
      expr: "{ let mut r = Robot { x: 1, y: 1, dir: Dir::West }; r.apply(&Command::Teleport { x: -5, y: 9 }); r.apply(&Command::Forward(1)); r }",
      expected: "Robot { x: -6, y: 9, dir: West }",
    },
  ],
};

export default grader;
