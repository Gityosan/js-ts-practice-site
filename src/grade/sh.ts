// SDK 本体の wasm はインライン(base64)ではなく URL アセットとして配信する。
// 理由: インライン版(@wasmer/sdk/wasm-inline)は Vite バンドルで実行時エラー
// （"buf is not defined"）になったため。?url なら同一オリジンのアセットとして
// 配信され COEP とも整合する。
import wasmerModuleUrl from "@wasmer/sdk/wasm?url";
import type { CaseResult, CliGraderDef } from "./types";

// 本物のシェル（bash）を @wasmer/sdk で実行する採点系。
//
// 制約:
// - @wasmer/sdk は内部で Web Worker スレッドプール＋SharedArrayBuffer を使うため
//   cross-origin isolation（COOP/COEP）が必須。coi-serviceworker で有効化している。
// - シェルパッケージ本体は実行時に Wasmer レジストリから取得する（fromRegistry）。
//   そのため初回はネットワークとダウンロードが挟まる。オフライン/レジストリ到達不可の
//   環境では取得に失敗するので、その場合は全ケースを分かりやすい理由で不合格にする。
// - 重い取得結果をセッション内で使い回すため、ワーカーではなくメインスレッドで実行し、
//   ロード結果をモジュールレベルにキャッシュする。

type ShellRunner = {
  run: (args: string[], stdin: string) => Promise<{ code: number; stdout: string; stderr: string }>;
};

const CASE_TIMEOUT_MS = 10000; // 1 ケースの実行上限（無限ループ対策の保険）

let shellPromise: Promise<ShellRunner> | null = null;

function isolationAvailable(): boolean {
  const g = globalThis as unknown as { crossOriginIsolated?: boolean };
  return typeof SharedArrayBuffer !== "undefined" && g.crossOriginIsolated === true;
}

function loadShell(): Promise<ShellRunner> {
  if (!shellPromise) {
    shellPromise = (async () => {
      if (!isolationAvailable()) {
        throw new Error(
          "本物のシェルには cross-origin isolation（SharedArrayBuffer）が必要です。ページを再読み込みしても有効にならない環境では実行できません。",
        );
      }
      const { init, Wasmer } = await import("@wasmer/sdk");
      await init({ module: wasmerModuleUrl });
      // シェル本体（bash）は Wasmer レジストリから取得する。オフラインや到達不可の
      // 環境では失敗するので、原因が分かるメッセージに包み直す。
      const pkg = await Wasmer.fromRegistry("sharrattj/bash").catch((e) => {
        throw new Error(
          `シェル本体（bash）の取得に失敗しました。ネットワーク接続を確認してください（${(e as Error).message}）`,
        );
      });
      const entrypoint = pkg.entrypoint;
      if (!entrypoint) throw new Error("シェルの実行エントリポイントが見つかりませんでした。");
      return {
        async run(args: string[], stdin: string) {
          const instance = await entrypoint.run({ args, stdin });
          const out = await instance.wait();
          return { code: out.code, stdout: out.stdout, stderr: out.stderr };
        },
      };
    })().catch((e) => {
      // 失敗したら次回リトライできるようキャッシュを捨てる
      shellPromise = null;
      throw e;
    });
  }
  return shellPromise;
}

const normalize = (s: string): string => s.replace(/\n+$/, "");

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("時間切れ")), ms)),
  ]);
}

/** 学習者のシェルスクリプトを本物の bash で各ケース実行し、標準出力を突き合わせる。 */
export async function runShCases(grader: CliGraderDef, script: string): Promise<CaseResult[]> {
  let shell: ShellRunner;
  try {
    shell = await loadShell();
  } catch (e) {
    // 実行環境が用意できない場合は全ケースを同じ理由で落とす（クラッシュさせない）
    return grader.cases.map((c, i) => ({
      label: c.label ?? `ケース${i + 1}`,
      passed: false,
      detail: (e as Error).message,
    }));
  }

  const results: CaseResult[] = [];
  for (let i = 0; i < grader.cases.length; i++) {
    const c = grader.cases[i];
    const label = c.label ?? `ケース${i + 1}`;
    try {
      const stdin = typeof c.stdin === "string" ? c.stdin : c.stdin == null ? "" : String(c.stdin);
      // bash -c '<script>' の後ろの引数は $0, $1... になる。第1問では未使用。
      const res = await withTimeout(
        shell.run(["-c", script, ...(c.args ?? [])], stdin),
        CASE_TIMEOUT_MS,
      );
      if (res.code !== 0) {
        const firstLine = res.stderr.split("\n").find((l) => l.trim()) ?? `exit ${res.code}`;
        results.push({ label, passed: false, detail: firstLine });
        continue;
      }
      if (c.skipValueCheck) {
        results.push({ label, passed: true });
        continue;
      }
      const ok = normalize(res.stdout) === normalize(c.expected);
      results.push({
        label,
        passed: ok,
        detail: ok
          ? undefined
          : `期待 ${JSON.stringify(c.expected)} / 実際 ${JSON.stringify(res.stdout)}`,
      });
    } catch (err) {
      results.push({ label, passed: false, detail: (err as Error).message });
    }
  }
  return results;
}
