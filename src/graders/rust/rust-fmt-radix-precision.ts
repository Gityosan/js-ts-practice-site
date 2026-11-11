import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "price: 小数 1 桁を 2 桁に", expr: "price(1234.5)", expected: '"¥1234.50"' },
    { label: "price: 0", expr: "price(0.0)", expected: '"¥0.00"' },
    { label: "color_hex: オレンジ", expr: "color_hex(255, 128, 0)", expected: '"#FF8000"' },
    {
      label: "color_hex: 1 桁の値もゼロ埋め",
      expr: "color_hex(1, 10, 171)",
      expected: '"#010AAB"',
    },
    { label: "bits: 5", expr: "bits(5)", expected: '"0b00000101"' },
    { label: "bits: 255", expr: "bits(255)", expected: '"0b11111111"' },
  ],
};

export default grader;
