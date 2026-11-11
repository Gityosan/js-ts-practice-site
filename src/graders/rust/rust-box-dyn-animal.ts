import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "猫を作る", expr: 'make_animal("cat").unwrap().speak()', expected: '"ニャー"' },
    { label: "知らない動物は None", expr: 'make_animal("fox").is_none()', expected: "true" },
    {
      label: "合唱",
      expr: 'chorus(&[make_animal("dog").unwrap(), make_animal("cow").unwrap(), make_animal("cat").unwrap()])',
      expected: '"ワン モー ニャー"',
    },
    { label: "1 匹だけ", expr: "chorus(&[Box::new(Dog) as Box<dyn Animal>])", expected: '"ワン"' },
    { label: "誰もいない", expr: "chorus(&[])", expected: '""' },
  ],
};

export default grader;
