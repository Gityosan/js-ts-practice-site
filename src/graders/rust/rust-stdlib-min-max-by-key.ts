import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "人口最大",
      expr: '{ let c = vec![City { name: "A".into(), population: 300, temp: 20.5 }, City { name: "B".into(), population: 900, temp: 31.0 }, City { name: "C".into(), population: 100, temp: -2.5 }]; most_populated(&c) }',
      expected: 'Some("B")',
    },
    {
      label: "人口最小",
      expr: '{ let c = vec![City { name: "A".into(), population: 300, temp: 20.5 }, City { name: "B".into(), population: 900, temp: 31.0 }, City { name: "C".into(), population: 100, temp: -2.5 }]; least_populated(&c) }',
      expected: 'Some("C")',
    },
    {
      label: "最高気温",
      expr: '{ let c = vec![City { name: "A".into(), population: 300, temp: 20.5 }, City { name: "B".into(), population: 900, temp: 31.0 }, City { name: "C".into(), population: 100, temp: -2.5 }]; hottest(&c) }',
      expected: 'Some("B")',
    },
    {
      label: "気温の範囲",
      expr: '{ let c = vec![City { name: "A".into(), population: 300, temp: 20.5 }, City { name: "B".into(), population: 900, temp: 31.0 }, City { name: "C".into(), population: 100, temp: -2.5 }]; temp_range(&c) }',
      expected: "Some((-2.5, 31.0))",
    },
    {
      label: "空なら None",
      expr: "(most_populated(&[]), least_populated(&[]), hottest(&[]), temp_range(&[]))",
      expected: "(None, None, None, None)",
    },
  ],
};

export default grader;
