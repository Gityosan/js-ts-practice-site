// Node/vitest 向け同期版 grader（Web Worker 不使用）
import ts from "typescript";
import { deepEqual } from "./deepEqual";
import { spy } from "./spy";
import type { Problem, GraderResult, CaseResult } from "./schemas";

const sandboxEnv = { spy, deepEqual };
const sandboxKeys = Object.keys(sandboxEnv);
const sandboxVals = Object.values(sandboxEnv);

function transpileTs(code: string): string {
  return ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      strict: false,
    },
  }).outputText;
}

function evalInSandbox<T>(fnBody: string): T {
  return new Function(...sandboxKeys, `"use strict"; return (${fnBody})`)(...sandboxVals) as T;
}

export async function runGrader(problem: Problem, learnerCode: string): Promise<GraderResult> {
  const g = problem.grader;
  const jsCode = transpileTs(learnerCode);

  if (g.kind === "io") {
    const fn = evalInSandbox<(...args: unknown[]) => unknown>(
      `(function(){ ${jsCode}\n return ${g.entry ?? "solve"}; })()`,
    );

    const results: CaseResult[] = g.cases.map((c, index) => {
      try {
        const output = fn(...c.input);
        const passed = deepEqual(output, c.expected, {
          epsilon: c.epsilon ?? 1e-9,
          unordered: c.unordered,
        });
        return { index, passed, output };
      } catch (err: unknown) {
        return { index, passed: false, error: (err as Error).message };
      }
    });

    let schemaError: string | undefined;
    if (g.outputSchema && results[0]?.output !== undefined) {
      const parsed = g.outputSchema.safeParse(results[0].output);
      if (!parsed.success) {
        schemaError = parsed.error.issues.map((i) => i.message).join(", ");
      }
    }

    const passed = results.filter((r) => r.passed).length;
    return { passed, total: results.length, schemaError, results };
  }

  // state grader
  const setupFn = evalInSandbox<() => Record<string, unknown>>(g.setupMocks.toString());
  const scope = setupFn();

  const scopeKeys = Object.keys(scope);
  const scopeVals = Object.values(scope);
  new Function(...scopeKeys, `"use strict";\n${jsCode}`)(...scopeVals);

  const results = g.asserts.map((a, index) => {
    try {
      const passed = a.check(scope);
      return { index, label: a.label, passed };
    } catch (err: unknown) {
      return { index, label: a.label, passed: false, error: (err as Error).message };
    }
  });

  const passed = results.filter((r) => r.passed).length;
  return { passed, total: results.length, results };
}
