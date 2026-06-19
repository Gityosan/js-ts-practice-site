import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.array(z.string()),
  cases: [
    {
      label: "英語名を並べ替え",
      input: [["Charlie", "Alice", "Bob"]],
      expected: ["Alice", "Bob", "Charlie"],
    },
    {
      label: "すでに順番通り",
      input: [["Apple", "Banana", "Cherry"]],
      expected: ["Apple", "Banana", "Cherry"],
    },
    {
      label: "逆順",
      input: [["Zara", "Mike", "Anna"]],
      expected: ["Anna", "Mike", "Zara"],
    },
    { label: "空配列", input: [[]], expected: [] },
    {
      label: "1 要素",
      input: [["Solo"]],
      expected: ["Solo"],
    },
  ],
  assertMethod: "sort",
};

export default grader;
