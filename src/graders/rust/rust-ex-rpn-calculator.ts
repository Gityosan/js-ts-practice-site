import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "足し算", expr: 'eval_rpn("1 2 +")', expected: "Ok(3)" },
    { label: "(3 + 4) * 2", expr: 'eval_rpn("3 4 + 2 *")', expected: "Ok(14)" },
    { label: "引き算と割り算の順序", expr: 'eval_rpn("10 2 3 * - 2 /")', expected: "Ok(2)" },
    { label: "負の数", expr: 'eval_rpn("-5 3 *")', expected: "Ok(-15)" },
    { label: "数が足りない", expr: 'eval_rpn("1 +")', expected: 'Err("数が足りません")' },
    { label: "0 で割る", expr: 'eval_rpn("4 0 /")', expected: 'Err("0 で割れません")' },
    { label: "不明なトークン", expr: 'eval_rpn("1 2 ^")', expected: 'Err("不明なトークン: ^")' },
    {
      label: "数が余る・空",
      expr: '(eval_rpn("1 2"), eval_rpn(""))',
      expected: '(Err("式が不正です"), Err("式が不正です"))',
    },
  ],
};

export default grader;
