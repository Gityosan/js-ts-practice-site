import type { GraderDef } from "../../grade/types";

// Rust 問題の採点定義。ファイル名（拡張子なし）＝ 問題 id。
// 例: graders/rust/rust-add.ts は問題 id "rust-add" の採点定義。
// 採点定義は必要になったとき（実行ボタン）に初めて読み込む。
const modules = import.meta.glob<{ default: GraderDef }>("./rust-*.ts");

export const rustGraders: Record<string, () => Promise<GraderDef>> = Object.fromEntries(
  Object.entries(modules).map(([path, load]) => [
    path.replace(/^\.\//, "").replace(/\.ts$/, ""),
    () => load().then((m) => m.default),
  ]),
);
