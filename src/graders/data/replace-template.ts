import { z } from "zod";
import type { IoGraderDef } from "../../grade/types";

const grader: IoGraderDef = {
  kind: "io",
  entry: "solve",
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
};

export default grader;
