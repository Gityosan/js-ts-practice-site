import type { Jq, JqInput } from "jq-wasm/inline";
import type { CaseResult, CliCase } from "./types";

// jq-wasm/inline は wasm を JS に埋め込んだビルド。配信パス問題が起きず
// GitHub Pages（静的配信）でも確実に動く。初回だけ wasm をコンパイルするので
// ロード結果をキャッシュして使い回す。
let jqPromise: Promise<Jq> | null = null;

export function getJq(): Promise<Jq> {
  if (!jqPromise) {
    jqPromise = import("jq-wasm/inline").then((m) => m.loadJq());
  }
  return jqPromise;
}

// jq は末尾に改行を付けたり付けなかったりするので、比較前に末尾改行をそろえる。
const normalize = (s: string): string => s.replace(/\n+$/, "");

/** 1 ケースを本物の jq で実行し、標準出力を expected と比較する。 */
export function gradeJqCase(jq: Jq, c: CliCase, filter: string, label: string): CaseResult {
  try {
    const res = jq.raw(c.stdin as JqInput, filter, c.args);
    if (res.exitCode !== 0) {
      const firstLine = res.stderr.split("\n").find((l) => l.trim()) ?? `exit ${res.exitCode}`;
      return { label, passed: false, detail: firstLine };
    }
    const ok = normalize(res.stdout) === normalize(c.expected);
    return {
      label,
      passed: ok,
      detail: ok
        ? undefined
        : `期待 ${JSON.stringify(c.expected)} / 実際 ${JSON.stringify(res.stdout)}`,
    };
  } catch (err) {
    return { label, passed: false, detail: (err as Error).message };
  }
}
