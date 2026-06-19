import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";
import { ProductSchema } from "../../problems/data/find-product";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.union([ProductSchema, z.undefined()]),
  cases: [
    {
      label: "p2 を探す",
      input: [
        [
          { id: "p1", name: "コーヒー", price: 500 },
          { id: "p2", name: "紅茶", price: 400 },
        ],
        "p2",
      ],
      expected: { id: "p2", name: "紅茶", price: 400 },
    },
    {
      label: "存在しない id → undefined",
      input: [
        [
          { id: "p1", name: "コーヒー", price: 500 },
          { id: "p2", name: "紅茶", price: 400 },
        ],
        "p9",
      ],
      expected: undefined,
    },
    {
      label: "先頭の要素を探す",
      input: [
        [
          { id: "a1", name: "りんご", price: 200 },
          { id: "a2", name: "みかん", price: 150 },
          { id: "a3", name: "バナナ", price: 100 },
        ],
        "a1",
      ],
      expected: { id: "a1", name: "りんご", price: 200 },
    },
    {
      label: "空配列 → undefined",
      input: [[], "p1"],
      expected: undefined,
    },
    {
      label: "末尾の要素を探す",
      input: [
        [
          { id: "x1", name: "ペン", price: 100 },
          { id: "x2", name: "ノート", price: 200 },
          { id: "x3", name: "消しゴム", price: 80 },
        ],
        "x3",
      ],
      expected: { id: "x3", name: "消しゴム", price: 80 },
    },
  ],
};

export default grader;
