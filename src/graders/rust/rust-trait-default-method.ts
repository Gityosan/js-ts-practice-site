import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "Person の name",
      expr: 'Person { name: "Alice".to_string() }.name()',
      expected: '"Alice"',
    },
    {
      label: "Person はデフォルトの greet",
      expr: 'Person { name: "Alice".to_string() }.greet()',
      expected: '"Hello, Alice!"',
    },
    { label: "Robot の name", expr: "Robot { id: 7 }.name()", expected: '"R-7"' },
    {
      label: "Robot は上書きした greet",
      expr: "Robot { id: 7 }.greet()",
      expected: '"BEEP. I AM R-7."',
    },
  ],
};

export default grader;
