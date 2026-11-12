/// <reference types="node" />
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { RustExecutor } from "./rust";

// Node（vitest / CI）用の実行器: ローカルの rustc でコンパイルして実行する。
// ブラウザの Playground と同じく edition 2024・デバッグビルド（オーバーフロー検査あり）。

export function rustcAvailable(): boolean {
  try {
    execFileSync("rustc", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export const localRustExecutor: RustExecutor = async (program) => {
  const dir = mkdtempSync(join(tmpdir(), "rust-grade-"));
  try {
    const src = join(dir, "main.rs");
    const bin = join(dir, "main");
    writeFileSync(src, program);
    const compile = spawnSync("rustc", ["--edition", "2024", "-C", "debuginfo=0", "-o", bin, src], {
      encoding: "utf8",
      timeout: 60000,
    });
    if (compile.status !== 0) {
      return { success: false, compileError: true, stdout: "", stderr: compile.stderr };
    }
    const run = spawnSync(bin, [], { encoding: "utf8", timeout: 10000 });
    return {
      success: run.status === 0,
      compileError: false,
      stdout: run.stdout ?? "",
      stderr: `${compile.stderr}${run.stderr ?? ""}`,
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};
