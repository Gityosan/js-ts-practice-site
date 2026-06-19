import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.record(z.string(), z.number()),
  cases: [
    {
      label: "東西 2 地域",
      input: [
        [
          { region: "東", amount: 100 },
          { region: "西", amount: 200 },
          { region: "東", amount: 300 },
        ],
      ],
      expected: { 東: 400, 西: 200 },
    },
    {
      label: "同じ地域だけ",
      input: [
        [
          { region: "北", amount: 50 },
          { region: "北", amount: 150 },
        ],
      ],
      expected: { 北: 200 },
    },
    {
      label: "3 地域",
      input: [
        [
          { region: "A", amount: 10 },
          { region: "B", amount: 20 },
          { region: "C", amount: 30 },
          { region: "A", amount: 40 },
        ],
      ],
      expected: { A: 50, B: 20, C: 30 },
    },
    {
      label: "空配列",
      input: [[]],
      expected: {},
    },
    {
      label: "1 件",
      input: [[{ region: "南", amount: 999 }]],
      expected: { 南: 999 },
    },
  ],
  assertMethod: "reduce",
  bonusCases: [
    { label: "for...of で繰り返した", pattern: "for\\s*\\(.*of\\s" },
    { label: "forEach で繰り返した", pattern: "\\.forEach\\s*\\(" },
  ],
};

export default grader;
