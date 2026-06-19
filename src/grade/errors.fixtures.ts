export const beginnerMistakes = [
  { id: "call-non-fn",    code: `const x = 5; x();` },
  { id: "undef-ref",      code: `total + 1;` },
  { id: "null-prop",      code: `const el = null; el.value;` },
  { id: "syntax-paren",   code: `return [1, 2, 3` },
  { id: "const-reassign", code: `const x = 1; x = 2;` },
  { id: "reduce-empty",   code: `[].reduce((acc, n) => acc + n);` },
  { id: "max-call-stack", code: `function f() { return f(); } f();` },
];
