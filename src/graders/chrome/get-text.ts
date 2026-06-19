import { spy } from "../../core/spy";
import { deepEqual } from "../../grade/deepEqual";
import type { StateGraderDef } from "../../grade/types";

const MOCK_ITEMS = [
  { textContent: "りんご" },
  { textContent: "バナナ" },
  { textContent: "みかん" },
];
const EXPECTED_TEXTS = ["りんご", "バナナ", "みかん"];

const grader: StateGraderDef = {
  kind: "state",
  setupMocks: () => {
    const texts: string[] = [];

    const qsaSpy = spy((...args: unknown[]) => {
      if ((args[0] as string) === ".item") {
        return { forEach: (fn: (el: unknown) => void) => MOCK_ITEMS.forEach(fn) };
      }
      return { forEach: () => {} };
    });

    const document = { querySelectorAll: qsaSpy };
    return { document, texts, _qsa: qsaSpy };
  },
  asserts: [
    {
      label: 'querySelectorAll(".item") が呼ばれた',
      check: (scope) => {
        const qsa = scope._qsa as ReturnType<typeof spy>;
        return qsa.calls.some(([s]) => s === ".item");
      },
    },
    {
      label: `全要素のテキストが収集された（${EXPECTED_TEXTS.join("、")}）`,
      check: (scope) => {
        const texts = scope.texts as string[];
        return deepEqual(texts, EXPECTED_TEXTS);
      },
    },
  ],
};

export default grader;
