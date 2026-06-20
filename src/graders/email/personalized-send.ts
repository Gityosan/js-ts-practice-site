import { spy } from "../../core/spy";
import { callsToEmails } from "../../grade/visual";
import type { StateGraderDef } from "../../grade/types";

const MEMBERS = [
  { name: "田中", email: "tanaka@example.com" },
  { name: "佐藤", email: "sato@example.com" },
  { name: "鈴木", email: "suzuki@example.com" },
];

const grader: StateGraderDef = {
  kind: "state",
  setupMocks: () => {
    const sendEmailSpy = spy<(...args: unknown[]) => void>();
    return {
      sendEmail: sendEmailSpy,
      members: MEMBERS.map((m) => ({ ...m })),
      _sendEmail: sendEmailSpy,
    };
  },
  asserts: [
    {
      label: "全員（3人）に送った",
      check: (scope) => {
        const se = scope._sendEmail as ReturnType<typeof spy>;
        return se.calls.length === 3;
      },
    },
    {
      label: "各メンバーのメールアドレスに送った",
      check: (scope) => {
        const se = scope._sendEmail as ReturnType<typeof spy>;
        const tos = se.calls.map(([to]) => to as string);
        return MEMBERS.every((m) => tos.includes(m.email));
      },
    },
    {
      label: '件名が "お知らせ" になっている',
      check: (scope) => {
        const se = scope._sendEmail as ReturnType<typeof spy>;
        return se.calls.every(([, subject]) => subject === "お知らせ");
      },
    },
    {
      label: "本文に名前が差し込まれている（〇〇様 の形）",
      check: (scope) => {
        const se = scope._sendEmail as ReturnType<typeof spy>;
        const bodies = se.calls.map(([, , body]) => body as string);
        return MEMBERS.every((m) => bodies.some((b) => b.includes(`${m.name}様`)));
      },
    },
  ],
  bonusCases: [
    { label: "forEach で全員に送った", pattern: "\\.forEach\\s*\\(" },
    { label: "for...of で全員に送った", pattern: "for\\s*\\(.*of\\s" },
    { label: "+ 演算子で名前を差し込んだ", pattern: "\\+.*様|様.*\\+" },
  ],
  visualize: (scope) => callsToEmails((scope._sendEmail as ReturnType<typeof spy>).calls),
};

export default grader;
