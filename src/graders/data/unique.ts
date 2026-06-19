import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  outputSchema: z.array(z.number()),
  cases: [
    { label: "重複あり", input: [[1, 2, 2, 3, 1]], expected: [1, 2, 3] },
    { label: "全部同じ", input: [[5, 5, 5]], expected: [5] },
    { label: "重複なし", input: [[1, 2, 3]], expected: [1, 2, 3] },
    { label: "空配列", input: [[]], expected: [] },
    { label: "1 要素", input: [[7]], expected: [7] },
  ],
  bonusCases: [
    { label: "Set を使って重複を除いた", pattern: "new Set" },
    { label: "indexOf() で重複チェックした", pattern: "\\.indexOf\\s*\\(" },
    { label: "includes() で重複チェックした", pattern: "\\.includes\\s*\\(" },
  ],
};

export default grader;
