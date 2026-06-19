import { spy } from "../../core/spy";
import type { StateGraderDef } from "../../grade/types";

const grader: StateGraderDef = {
  kind: "state",
  setupMocks: () => {
    const buttons = [{ disabled: false }, { disabled: false }, { disabled: false }];

    const qsaSpy = spy((...args: unknown[]) => {
      if ((args[0] as string) === "button") {
        return { forEach: (fn: (b: unknown) => void) => buttons.forEach(fn) };
      }
      return { forEach: () => {} };
    });
    const qsSpy = spy((...args: unknown[]) => {
      if ((args[0] as string) === "button") return buttons[0];
      return null;
    });

    const document = { querySelectorAll: qsaSpy, querySelector: qsSpy };
    return { document, _buttons: buttons, _qsa: qsaSpy };
  },
  asserts: [
    {
      label: 'querySelectorAll("button") が呼ばれた',
      check: (scope) => {
        const qsa = scope._qsa as ReturnType<typeof spy>;
        return qsa.calls.some(([s]) => s === "button");
      },
    },
    {
      label: "全ボタン（3つ）が disabled になった",
      check: (scope) => {
        const btns = scope._buttons as { disabled: boolean }[];
        return btns.every((b) => b.disabled === true);
      },
    },
  ],
};

export default grader;
