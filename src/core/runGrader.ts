import GraderWorker from "../worker/grader.worker?worker";
import type { CaseResult, GradeResult } from "../grade/types";
import type { VisualState } from "../grade/visual";

export type { CaseResult, GradeResult };

const CASE_TIMEOUT_MS = 2000;

export function runGrader(problemId: string, learnerJs: string): Promise<GradeResult> {
  return new Promise((resolve) => {
    const worker = new GraderWorker();
    const results: CaseResult[] = [];
    let total = 0;
    let visual: VisualState | undefined;
    let timer: ReturnType<typeof setTimeout>;

    const finish = (status: GradeResult["status"], error?: string) => {
      clearTimeout(timer);
      worker.terminate();
      const normalResults = results.filter((r) => !r.bonus);
      resolve({
        passed: normalResults.filter((r) => r.passed).length,
        total: Math.max(total, normalResults.length),
        results,
        status,
        error,
        visual,
      });
    };

    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        for (let i = results.length; i < total; i++)
          results.push({ label: `ケース${i + 1}`, passed: false, detail: "時間切れ" });
        finish("timeout");
      }, CASE_TIMEOUT_MS);
    };

    worker.onmessage = (e: MessageEvent) => {
      const m = e.data;
      if (m.type === "meta") {
        total = m.total;
        arm();
      } else if (m.type === "case" || m.type === "bonus") {
        results.push(m.result);
        arm();
      } else if (m.type === "visual") {
        visual = m.state;
      } else if (m.type === "done") {
        finish("ok");
      } else if (m.type === "error") {
        finish("error", m.message);
      }
    };
    worker.onerror = (e) => finish("error", e.message);

    worker.postMessage({ problemId, learnerJs });
    arm();
  });
}
