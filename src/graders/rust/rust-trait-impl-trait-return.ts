import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "Dog の speak", expr: "Dog.speak()", expected: '"Dog says woof"' },
    { label: "loud に Dog", expr: "loud(&Dog)", expected: '"DOG SAYS WOOF!"' },
    { label: "make_cat の speak", expr: 'make_cat("Tama").speak()', expected: '"Tama says meow"' },
    {
      label: "loud に make_cat の戻り値",
      expr: 'loud(&make_cat("Kuro"))',
      expected: '"KURO SAYS MEOW!"',
    },
  ],
};

export default grader;
