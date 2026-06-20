import { spy } from "../../core/spy";
import { callsToEmails } from "../../grade/visual";
import type { StateGraderDef } from "../../grade/types";

const RECIPIENTS = ["alice@example.com", "bob@example.com", "carol@example.com"];
const REPORT = "今週の売上: 120万円。前週比 +5%。";
const SUBJECT = "週次レポート";

const grader: StateGraderDef = {
  kind: "state",
  setupMocks: () => {
    const sendEmailSpy = spy<(...args: unknown[]) => void>();
    return {
      sendEmail: sendEmailSpy,
      recipients: [...RECIPIENTS],
      report: REPORT,
      _sendEmail: sendEmailSpy,
    };
  },
  asserts: [
    {
      label: "全員（3人）に送った",
      check: (scope) => {
        const se = scope._sendEmail as ReturnType<typeof spy>;
        const tos = se.calls.map(([to]) => to as string);
        return RECIPIENTS.every((r) => tos.includes(r));
      },
    },
    {
      label: '件名が "週次レポート"',
      check: (scope) => {
        const se = scope._sendEmail as ReturnType<typeof spy>;
        return se.calls.every(([, subject]) => subject === SUBJECT);
      },
    },
    {
      label: "本文がレポート内容",
      check: (scope) => {
        const se = scope._sendEmail as ReturnType<typeof spy>;
        return se.calls.every(([, , body]) => body === REPORT);
      },
    },
  ],
  bonusCases: [
    { label: "forEach で全員に送った", pattern: "\\.forEach\\s*\\(" },
    { label: "for...of で全員に送った", pattern: "for\\s*\\(.*of\\s" },
    { label: "for...in でインデックスを使った", pattern: "for\\s*\\(.*in\\s" },
  ],
  visualize: (scope) => callsToEmails((scope._sendEmail as ReturnType<typeof spy>).calls),
};

export default grader;
