import { z } from "zod";
import { autoTable } from "../../grade/visual";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
  visualize: (output, input) => autoTable(input[0], { label: "置換後", value: output }),
  outputSchema: z.string(),
  cases: [
    {
      label: "基本的な置き換え",
      input: ["こんにちは、{{name}}さん！", "Alice"],
      expected: "こんにちは、Aliceさん！",
    },
    {
      label: "英語テンプレート",
      input: ["Hello, {{name}}!", "Bob"],
      expected: "Hello, Bob!",
    },
    {
      label: "{{name}} が複数ある",
      input: ["{{name}} と {{name}}", "Charlie"],
      expected: "Charlie と Charlie",
    },
    {
      label: "テンプレートなし（そのまま返る）",
      input: ["変更なし", "Alice"],
      expected: "変更なし",
    },
    {
      label: "空の名前",
      input: ["{{name}}さん", ""],
      expected: "さん",
    },
  ],
  assertMethod: "replace",
  bonusCases: [
    { label: "/g フラグ付き正規表現で全置換した", pattern: "/g" },
    { label: "replaceAll() で全置換した", pattern: "\\.replaceAll\\s*\\(" },
  ],
};

export default grader;
