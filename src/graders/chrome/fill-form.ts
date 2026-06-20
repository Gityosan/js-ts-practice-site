import { spy } from "../../core/spy";
import type { StateGraderDef } from "../../grade/types";

const EXPECTED_USERNAME = "tanaka";
const EXPECTED_PASSWORD = "hunter2";

const grader: StateGraderDef = {
  kind: "state",
  setupMocks: () => {
    const fields: Record<string, { value: string }> = {
      "#username": { value: "" },
      "#password": { value: "" },
    };
    const querySelectorSpy = spy((...args: unknown[]) => {
      const selector = args[0] as string;
      return fields[selector] ?? null;
    });
    const document = { querySelector: querySelectorSpy };

    return { document, _fields: fields, _qs: querySelectorSpy };
  },
  asserts: [
    {
      label: `querySelector が "#username" で呼ばれた`,
      check: (scope) => {
        const qs = scope._qs as ReturnType<typeof spy>;
        return qs.calls.some(([s]) => s === "#username");
      },
    },
    {
      label: `querySelector が "#password" で呼ばれた`,
      check: (scope) => {
        const qs = scope._qs as ReturnType<typeof spy>;
        return qs.calls.some(([s]) => s === "#password");
      },
    },
    {
      label: `#username に "${EXPECTED_USERNAME}" がセットされた`,
      check: (scope) => {
        const fields = scope._fields as Record<string, { value: string }>;
        return fields["#username"].value === EXPECTED_USERNAME;
      },
    },
    {
      label: `#password に "${EXPECTED_PASSWORD}" がセットされた`,
      check: (scope) => {
        const fields = scope._fields as Record<string, { value: string }>;
        return fields["#password"].value === EXPECTED_PASSWORD;
      },
    },
  ],
  bonusCases: [
    { label: "getElementById() で要素を取得した", pattern: "getElementById\\s*\\(" },
    { label: "as HTMLInputElement で型アサーションした", pattern: "as\\s+HTMLInputElement" },
  ],
  visualize: (scope) => {
    const fields = scope._fields as Record<string, { value: string }>;
    const labelOf: Record<string, string> = { "#username": "ユーザー名", "#password": "パスワード" };
    return {
      kind: "form",
      title: "ログインフォーム（サンドボックス）",
      fields: Object.entries(fields).map(([sel, f]) => ({
        label: `${labelOf[sel] ?? sel}（${sel}）`,
        value: f.value,
        filled: f.value !== "",
      })),
    };
  },
};

export default grader;
