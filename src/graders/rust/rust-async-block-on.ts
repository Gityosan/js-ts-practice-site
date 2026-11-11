import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "async ブロック", expr: "block_on(async { 1 + 2 })", expected: "3" },
    { label: "async fn を実行", expr: "block_on(add(20, 22))", expected: "42" },
    {
      label: ".await を連ねる",
      expr: "block_on(async { add(1, 2).await * add(3, 4).await })",
      expected: "21",
    },
    {
      label: "String を返す",
      expr: 'block_on(async { String::from("done") })',
      expected: '"done"',
    },
    {
      label: "Pending を返す Future も待てる",
      expr: "block_on(std::future::poll_fn({ let mut n = 0; move |_cx: &mut Context<'_>| { n += 1; if n < 5 { Poll::Pending } else { Poll::Ready(n) } } }))",
      expected: "5",
    },
  ],
};

export default grader;
