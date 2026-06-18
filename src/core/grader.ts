import type { Problem, GraderResult, CaseResult } from "./schemas";
import SandboxWorker from "../worker/sandbox.worker?worker";

export async function runGrader(problem: Problem, learnerCode: string): Promise<GraderResult> {
  const g = problem.grader;

  return new Promise((resolve) => {
    const worker = new SandboxWorker();

    const timeoutId = setTimeout(() => {
      worker.terminate();
      const total = g.kind === "io" ? g.cases.length : g.asserts.length;
      resolve({ passed: 0, total, timedOut: true, results: [] });
    }, 6000);

    worker.onerror = (e: ErrorEvent) => {
      clearTimeout(timeoutId);
      worker.terminate();
      const total = g.kind === "io" ? g.cases.length : g.asserts.length;
      resolve({ passed: 0, total, results: [{ index: 0, passed: false, error: e.message }] });
    };

    worker.onmessage = (e: MessageEvent) => {
      clearTimeout(timeoutId);
      worker.terminate();

      const data = e.data;

      if (data.type === "timeout") {
        const total = g.kind === "io" ? g.cases.length : g.asserts.length;
        resolve({ passed: 0, total, timedOut: true, results: [] });
        return;
      }

      if (data.type === "error") {
        const total = g.kind === "io" ? g.cases.length : g.asserts.length;
        resolve({ passed: 0, total, results: [{ index: 0, passed: false, error: data.error }] });
        return;
      }

      if (data.type === "io-result") {
        const results: CaseResult[] = data.results;

        // Shape validation via outputSchema (main thread, uses Zod)
        let schemaError: string | undefined;
        if (g.kind === "io" && g.outputSchema && results[0]?.output !== undefined) {
          const parsed = g.outputSchema.safeParse(results[0].output);
          if (!parsed.success) {
            schemaError = parsed.error.issues.map((i) => i.message).join(", ");
          }
        }

        const passed = results.filter((r) => r.passed).length;
        resolve({ passed, total: results.length, schemaError, results });
        return;
      }

      if (data.type === "state-result") {
        const results = data.results;
        const passed = results.filter((r: { passed: boolean }) => r.passed).length;
        resolve({ passed, total: results.length, results });
        return;
      }
    };

    if (g.kind === "io") {
      worker.postMessage({
        type: "io",
        code: learnerCode,
        entry: g.entry ?? "solve",
        cases: g.cases,
      });
    } else {
      worker.postMessage({
        type: "state",
        code: learnerCode,
        setupCode: g.setupMocks.toString(),
        assertsCode: g.asserts.map((a) => ({
          label: a.label,
          checkCode: a.check.toString(),
        })),
      });
    }
  });
}
