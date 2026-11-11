import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-circle-cylinder",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "円の面積と円柱の体積",
    prompt: `## やること

- \`circle_area(r)\` … 半径 \`r\` の円の面積（π × r × r）を返す
- \`cylinder_volume(r, h)\` … 半径 \`r\`・高さ \`h\` の円柱の体積を返す。**\`circle_area\` を使って** 書こう

\`\`\`rust
circle_area(1.0)            // 3.141592653589793
cylinder_volume(1.0, 2.0)   // 6.283185307179586
\`\`\`

## ポイント

- 円周率は標準ライブラリの \`std::f64::consts::PI\` を使う
- 引数が複数ある関数は \`fn f(a: f64, b: f64)\` のようにカンマで区切り、それぞれに型を書く
- 長い名前は \`use std::f64::consts::PI;\` と書いておくと \`PI\` だけで使える`,
    hints: ["`std::f64::consts::PI * r * r`", "`circle_area(r) * h`"],
  },
  initialCode: `use std::f64::consts::PI;

fn circle_area(r: f64) -> f64 {
    todo!()
}

fn cylinder_volume(r: f64, h: f64) -> f64 {
    todo!()
}
`,
  solutionCode: `use std::f64::consts::PI;

fn circle_area(r: f64) -> f64 {
    PI * r * r
}

fn cylinder_volume(r: f64, h: f64) -> f64 {
    circle_area(r) * h
}
`,
});
