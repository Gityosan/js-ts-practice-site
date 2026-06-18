import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";
import { SaleSchema } from "../../problems/data/sum-sales";

type Sale = { id: string; region: string; amount: number };

const salesData: Sale[] = [
  { id: "sale-0", region: "東京", amount: 1200 },
  { id: "sale-1", region: "大阪", amount: 800 },
  { id: "sale-2", region: "東京", amount: 500 },
  { id: "sale-3", region: "福岡", amount: 300 },
  { id: "sale-4", region: "東京", amount: 900 },
];

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.number(),
  cases: [
    {
      input: [salesData],
      expected: salesData
        .filter((s) => s.region === "東京")
        .reduce((acc, s) => acc + s.amount, 0),
    },
    {
      input: [[{ id: "a", region: "東京", amount: 500 }]],
      expected: 500,
    },
    {
      input: [[{ id: "b", region: "大阪", amount: 999 }]],
      expected: 0,
    },
    {
      input: [[]],
      expected: 0,
    },
  ],
};

// re-export so grader can reference the same schema as the test
export { SaleSchema };

export default grader;
