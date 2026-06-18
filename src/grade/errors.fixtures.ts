export const beginnerMistakes = [
  { id: "call-non-fn", code: `const x = 5; x();` },
  { id: "undef-ref", code: `total + 1;` },
  { id: "null-prop", code: `const el = null; el.value;` },
  { id: "syntax-paren", code: `return [1, 2, 3` },
];
