import { spy } from "../../core/spy";
import { deepEqual } from "../../grade/deepEqual";
import type { StateGraderDef } from "../../grade/types";

const MOCK_VALUES = [[1200], [800], [1500], [600]];
const EXPECTED_TOTAL = 2700; // 1200 + 1500

const grader: StateGraderDef = {
  kind: "state",
  setupMocks: () => {
    const setValueSpy = spy<(...args: unknown[]) => void>();

    const makeRange = (r: string) => ({
      getValues: () => (r === "B2:B5" ? MOCK_VALUES.map((row) => [...row]) : [[0]]),
      getValue: () => 0,
      setValue: setValueSpy,
    });

    const SpreadsheetApp = {
      getActiveSpreadsheet: () => ({
        getActiveSheet: () => ({ getRange: makeRange }),
      }),
    };

    return { SpreadsheetApp, _setValue: setValueSpy };
  },
  asserts: [
    {
      label: `B6 に合計 ${EXPECTED_TOTAL}（1000以上の行のみ）がセットされた`,
      check: (scope) => {
        const sv = scope._setValue as ReturnType<typeof spy>;
        return sv.calls.some(([v]) => deepEqual(v, EXPECTED_TOTAL));
      },
    },
    {
      label: "setValue が 1 回呼ばれた",
      check: (scope) => {
        const sv = scope._setValue as ReturnType<typeof spy>;
        return sv.calls.length >= 1;
      },
    },
  ],
  bonusCases: [
    { label: "for...of で行を繰り返した", pattern: "for\\s*\\(.*of\\s" },
    { label: "filter() で条件絞り込みした", pattern: "\\.filter\\s*\\(" },
    { label: "reduce で条件付き合計した", pattern: "\\.reduce\\s*\\(" },
  ],
};

export default grader;
