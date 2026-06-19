import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.array(z.string()),
  cases: [
    {
      label: "スペースありカンマ区切り",
      input: ["Alice, Bob,  Charlie"],
      expected: ["Alice", "Bob", "Charlie"],
    },
    {
      label: "スペースなし",
      input: ["apple,banana,cherry"],
      expected: ["apple", "banana", "cherry"],
    },
    {
      label: "1 要素",
      input: ["  solo  "],
      expected: ["solo"],
    },
    {
      label: "前後に空白が多い",
      input: ["  a ,  b ,  c  "],
      expected: ["a", "b", "c"],
    },
    {
      label: "数値文字列",
      input: ["10, 20, 30"],
      expected: ["10", "20", "30"],
    },
  ],
  assertMethod: "split",
};

export default grader;
