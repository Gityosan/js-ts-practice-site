import GraderWorker from "../worker/grader.worker?worker";
import { graders } from "../graders/registry";
import type { CaseResult, GradeResult } from "../grade/types";
import type { VisualState } from "../grade/visual";

export type { CaseResult, GradeResult };

const CASE_TIMEOUT_MS = 2000;
// 初回メッセージまでは長めに待つ。cli（jq 等）は wasm のコールドコンパイルが挟まり
// 2 秒では間に合わないことがある。最初の case が返れば以降は通常のタイムアウトに戻す。
const BOOT_TIMEOUT_MS = 10000;

export async function runGrader(problemId: string, learnerJs: string): Promise<GradeResult> {
  // sh（本物のシェル）は @wasmer/sdk をメインスレッドで実行する。
  // 重い取得結果をセッション内でキャッシュするため、使い捨てワーカーには載せない。
  const g = await graders[problemId]();
  if (g.kind === "cli" && g.runtime === "sh") {
    const { runShCases } = await import("../grade/sh");
    const results = await runShCases(g, learnerJs);
    return {
      passed: results.filter((r) => r.passed).length,
      total: results.length,
      results,
      status: "ok",
    };
  }
  return runInWorker(problemId, learnerJs);
}

function runInWorker(problemId: string, learnerJs: string): Promise<GradeResult> {
  return new Promise((resolve) => {
    const worker = new GraderWorker();
    const results: CaseResult[] = [];
    let total = 0;
    let started = false;
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
      timer = setTimeout(
        () => {
          for (let i = results.length; i < total; i++)
            results.push({ label: `ケース${i + 1}`, passed: false, detail: "時間切れ" });
          finish("timeout");
        },
        started ? CASE_TIMEOUT_MS : BOOT_TIMEOUT_MS,
      );
    };

    worker.onmessage = (e: MessageEvent) => {
      const m = e.data;
      if (m.type === "meta") {
        total = m.total;
        arm();
      } else if (m.type === "case" || m.type === "bonus") {
        started = true;
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
