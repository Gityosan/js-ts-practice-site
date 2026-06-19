import { graders } from "../graders/registry";
import { deepEqual } from "../grade/deepEqual";
import { friendly } from "../grade/friendly";
import { fmt } from "../grade/fmt";

self.onmessage = async (e: MessageEvent<{ problemId: string; learnerJs: string }>) => {
  const { problemId, learnerJs } = e.data;
  try {
    const g = await graders[problemId]();

    if (g.kind === "io") {
      self.postMessage({ type: "meta", total: g.cases.length + (g.assertMethod ? 1 : 0) });
      const fn = new Function(`${learnerJs}; return ${g.entry ?? "solve"};`)();
      for (let i = 0; i < g.cases.length; i++) {
        const c = g.cases[i];
        const label = c.label ?? `ケース${i + 1}`;
        try {
          const out = await fn(...c.input);
          if (g.outputSchema && !g.outputSchema.safeParse(out).success) {
            self.postMessage({
              type: "case",
              result: { label, passed: false, detail: "形が違う" },
            });
            continue;
          }
          const ok = c.skipValueCheck
            ? true
            : deepEqual(out, c.expected, { epsilon: c.epsilon ?? 1e-9, unordered: c.unordered });
          self.postMessage({
            type: "case",
            result: {
              label,
              passed: ok,
              detail: ok ? undefined : `期待 ${fmt(c.expected)} / 実際 ${fmt(out)}`,
              output: c.skipValueCheck ? out : undefined,
            },
          });
        } catch (err) {
          self.postMessage({
            type: "case",
            result: { label, passed: false, detail: friendly(err).message },
          });
        }
      }
      if (g.assertMethod) {
        const used = new RegExp(`\\.${g.assertMethod}\\s*\\(`).test(learnerJs);
        self.postMessage({
          type: "case",
          result: {
            label: `\`.${g.assertMethod}()\` を使った`,
            passed: used,
            detail: used ? undefined : `\`.${g.assertMethod}()\` を使ってみよう`,
          },
        });
      }
      self.postMessage({ type: "done" });
    } else {
      self.postMessage({ type: "meta", total: g.asserts.length });
      const scope = g.setupMocks();
      try {
        const run = new Function(...Object.keys(scope), learnerJs);
        await run(...Object.values(scope));
      } catch {
        // partial credit: evaluate asserts on current scope state
      }
      for (const a of g.asserts) {
        let passed = false;
        try {
          passed = a.check(scope);
        } catch {
          passed = false;
        }
        self.postMessage({ type: "case", result: { label: a.label, passed } });
      }
      self.postMessage({ type: "done" });
    }
  } catch (err) {
    self.postMessage({ type: "error", message: friendly(err).message });
  }
};
