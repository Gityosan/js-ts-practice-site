import ts from "typescript";
import { deepEqual } from "../grade/deepEqual";
import { friendly } from "../grade/friendly";
import { fmt } from "../grade/fmt";
import type { GradeResult, CaseResult } from "../grade/types";
import { graders } from "../graders/registry";

export type { GradeResult, CaseResult };

function transpileTs(code: string): string {
  return ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      strict: false,
    },
  }).outputText;
}

export async function runGrader(problemId: string, learnerTs: string): Promise<GradeResult> {
  const g = await graders[problemId]();
  const learnerJs = transpileTs(learnerTs);
  const results: CaseResult[] = [];

  if (g.kind === "io") {
    const fn = new Function(`${learnerJs}; return ${g.entry ?? "solve"};`)();
    let firstOutput: unknown;
    let firstInput: unknown[] | undefined;
    for (let i = 0; i < g.cases.length; i++) {
      const c = g.cases[i];
      const label = c.label ?? `ケース${i + 1}`;
      try {
        const out = await fn(...c.input);
        if (i === 0) {
          firstOutput = out;
          firstInput = c.input;
        }
        if (g.outputSchema && !g.outputSchema.safeParse(out).success) {
          results.push({ label, passed: false, detail: "形が違う" });
          continue;
        }
        const ok = c.skipValueCheck
          ? true
          : deepEqual(out, c.expected, { epsilon: c.epsilon ?? 1e-9, unordered: c.unordered });
        results.push({
          label,
          passed: ok,
          detail: ok ? undefined : `期待 ${fmt(c.expected)} / 実際 ${fmt(out)}`,
          output: c.skipValueCheck ? out : undefined,
        });
      } catch (err) {
        results.push({ label, passed: false, detail: friendly(err).message });
      }
    }
    if (g.assertMethod) {
      const m = g.assertMethod;
      const used = new RegExp(`(?:Object\\.${m}|\\.${m})\\s*\\(`).test(learnerJs);
      results.push({
        label: `\`.${m}()\` を使った`,
        passed: used,
        detail: used ? undefined : `\`.${m}()\` を使ってみよう`,
      });
    }
    const bonusResults: CaseResult[] = [];
    if (g.bonusCases) {
      for (const bc of g.bonusCases) {
        if (new RegExp(bc.pattern).test(learnerJs)) {
          bonusResults.push({ label: bc.label, passed: true, bonus: true });
        }
      }
    }
    const allResults = [...results, ...bonusResults];
    let visual;
    if (g.visualize && firstInput) {
      try {
        visual = g.visualize(firstOutput, firstInput);
      } catch {
        // 視覚化失敗は採点に影響させない
      }
    }
    return {
      passed: results.filter((r) => r.passed).length,
      total: results.length,
      results: allResults,
      status: "ok",
      visual,
    };
  } else {
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
      results.push({ label: a.label, passed });
    }
    const stateBonusResults: CaseResult[] = [];
    if (g.bonusCases) {
      for (const bc of g.bonusCases) {
        if (new RegExp(bc.pattern).test(learnerJs)) {
          stateBonusResults.push({ label: bc.label, passed: true, bonus: true });
        }
      }
    }
    let stateVisual;
    if (g.visualize) {
      try {
        stateVisual = g.visualize(scope);
      } catch {
        // 視覚化失敗は採点に影響させない
      }
    }
    return {
      passed: results.filter((r) => r.passed).length,
      total: results.length,
      results: [...results, ...stateBonusResults],
      status: "ok",
      visual: stateVisual,
    };
  }
}
