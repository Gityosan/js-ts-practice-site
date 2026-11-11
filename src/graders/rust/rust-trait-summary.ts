import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "Article",
      expr: 'Article { title: "Rust入門".to_string(), author: "Ferris".to_string() }.summarize()',
      expected: '"Rust入門 by Ferris"',
    },
    {
      label: "Tweet",
      expr: 'Tweet { user: "rustlang".to_string(), text: "1.0 released".to_string() }.summarize()',
      expected: '"@rustlang: 1.0 released"',
    },
    {
      label: "notify に Tweet",
      expr: 'notify(&Tweet { user: "a".to_string(), text: "hi".to_string() })',
      expected: '"速報! @a: hi"',
    },
    {
      label: "notify に Article",
      expr: 'notify(&Article { title: "T".to_string(), author: "B".to_string() })',
      expected: '"速報! T by B"',
    },
  ],
};

export default grader;
