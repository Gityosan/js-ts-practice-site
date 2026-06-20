import { spy } from "../../core/spy";
import { deepEqual } from "../../grade/deepEqual";
import type { StateGraderDef } from "../../grade/types";

const MOCK_VALUES = [[1200], [800], [500], [2000]];
const EXPECTED_TOTAL = 4500;

const grader: StateGraderDef = {
  kind: "state",
  setupMocks: () => {
    const setValueSpy = spy<(v: unknown) => void>();

    const makeRange = (range: string) => ({
      getValues: () => {
        if (range === "B2:B5") return MOCK_VALUES.map((r) => [...r]);
        return [[0]];
      },
      getValue: () => 0,
      setValue: setValueSpy,
    });

    const SpreadsheetApp = {
      getActiveSpreadsheet: () => ({
        getActiveSheet: () => ({
          getRange: makeRange,
        }),
      }),
    };

    return { SpreadsheetApp, _setValue: setValueSpy };
  },
  asserts: [
    {
      label: `B6 に合計 ${EXPECTED_TOTAL} がセットされた`,
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
    { label: "for ループで合計した", pattern: "for\\s*\\(" },
    { label: "forEach で合計した", pattern: "\\.forEach\\s*\\(" },
    { label: "reduce で合計した", pattern: "\\.reduce\\s*\\(" },
  ],
  visualize: (scope) => {
    const sv = scope._setValue as ReturnType<typeof spy>;
    const total = sv.calls.length ? sv.calls[sv.calls.length - 1][0] : "";
    const grid: { value: string | number; highlight?: boolean }[][] = MOCK_VALUES.map((row) => [
      { value: row[0] },
    ]);
    grid.push([{ value: typeof total === "number" ? total : String(total ?? "—"), highlight: true }]);
    return { kind: "spreadsheet", headers: ["売上"], grid };
  },
};

export default grader;
