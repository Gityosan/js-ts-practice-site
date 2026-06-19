import { spy } from "../../core/spy";
import type { StateGraderDef } from "../../grade/types";

const EXPECTED_TO = "alice@co.jp,carol@co.jp";

const grader: StateGraderDef = {
  kind: "state",
  setupMocks: () => {
    const sendEmailSpy = spy<(...args: unknown[]) => void>();
    const GmailApp = { sendEmail: sendEmailSpy };
    return { GmailApp, _sendEmail: sendEmailSpy };
  },
  asserts: [
    {
      label: "sendEmail が 1 回呼ばれた",
      check: (scope) => {
        const s = scope._sendEmail as ReturnType<typeof spy>;
        return s.calls.length === 1;
      },
    },
    {
      label: `宛先が "${EXPECTED_TO}" になっている（bob は除外されている）`,
      check: (scope) => {
        const s = scope._sendEmail as ReturnType<typeof spy>;
        return s.calls.some(([to]) => to === EXPECTED_TO);
      },
    },
    {
      label: '件名が "週次レポート" になっている',
      check: (scope) => {
        const s = scope._sendEmail as ReturnType<typeof spy>;
        return s.calls.some(([, subject]) => subject === "週次レポート");
      },
    },
  ],
};

export default grader;
