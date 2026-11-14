import type { ProblemMeta } from "../../core/schemas";

// Rust 教材は数が多いので、ファイルを置くだけで登録されるようにしている。
// - decode/NN-slug.ts: 解読（1 行を予約語・名前・括弧に分解して読む）
// - read/NN-slug.ts  : 読む（動くコードの数字などを変えて、出力の変化を見る）
// - learn/NN-slug.ts : 読んで学ぶページ（教材＋確認クイズ）
// - write/NN-slug.ts : コードを書いて rustc で採点する問題
// ファイル名先頭の番号順に並ぶ（学習順）。各ファイルは defineProblem(...) を default export する。
const decodeModules = import.meta.glob<{ default: ProblemMeta }>("./decode/*.ts", { eager: true });
const readModules = import.meta.glob<{ default: ProblemMeta }>("./read/*.ts", { eager: true });
const learnModules = import.meta.glob<{ default: ProblemMeta }>("./learn/*.ts", { eager: true });
const writeModules = import.meta.glob<{ default: ProblemMeta }>("./write/*.ts", { eager: true });

const sortedDefaults = (mods: Record<string, { default: ProblemMeta }>): ProblemMeta[] =>
  Object.keys(mods)
    .sort()
    .map((k) => mods[k].default);

export const rustDecodeProblems: ProblemMeta[] = sortedDefaults(decodeModules);
export const rustReadProblems: ProblemMeta[] = sortedDefaults(readModules);
export const rustLearnProblems: ProblemMeta[] = sortedDefaults(learnModules);
export const rustWriteProblems: ProblemMeta[] = sortedDefaults(writeModules);
export const rustProblems: ProblemMeta[] = [
  ...rustDecodeProblems,
  ...rustReadProblems,
  ...rustLearnProblems,
  ...rustWriteProblems,
];
