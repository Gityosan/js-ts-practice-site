import { spy } from "../../core/spy";
import { deepEqual } from "../../grade/deepEqual";
import type { StateGraderDef } from "../../grade/types";

const MOCK_VALUES = [[100], [200], [300]];
const EXPECTED_TOTAL = 600;

const grader: StateGraderDef = {
  kind: "state",
  setupMocks: () => {
    const setValueSpy = spy<(...args: unknown[]) => void>();

    const makeRange = (r: string) => ({
      getValues: () => (r === "A2:A4" ? MOCK_VALUES.map((row) => [...row]) : [[0]]),
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
      label: `B1 に合計 ${EXPECTED_TOTAL} がセットされた`,
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
};

export default grader;
