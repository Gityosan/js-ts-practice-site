import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "赤の次は青", expr: "Light::Red.next()", expected: "Green" },
    { label: "黄の次は赤", expr: "Light::Yellow.next()", expected: "Red" },
    {
      label: "秒数",
      expr: "[Light::Red, Light::Green, Light::Yellow].map(|l| l.duration())",
      expected: "[30, 25, 3]",
    },
    {
      label: "進めるのは青だけ",
      expr: "[Light::Red, Light::Green, Light::Yellow].map(|l| l.can_go())",
      expected: "[false, true, false]",
    },
    { label: "3 ステップ", expr: "run(Light::Red, 3)", expected: "[Red, Green, Yellow, Red]" },
    { label: "0 ステップは start だけ", expr: "run(Light::Yellow, 0)", expected: "[Yellow]" },
  ],
};

export default grader;
