import { z } from "zod";

export const Stage = z.enum(["decode", "read", "learn", "write"]);
export type Stage = z.infer<typeof Stage>;

export const Scenario = z.enum(["basic", "data", "gas", "email", "chrome"]);
export type Scenario = z.infer<typeof Scenario>;

const Copy = z.object({
  title: z.string(),
  prompt: z.string(),
  hints: z.array(z.string()).default([]),
});

// 選択式クイズ。decode / learn で共有。「答えを出さず段階的に詰まらせる」装置（SPEC §0）。
// 表示時に選択肢はシャッフルされる（正解の位置は問わない）。
const Quiz = z.object({
  prompt: z.string(), // 設問（markdown 可）
  snippet: z.string().optional(), // 設問対象のコード片（ハイライト表示）
  choices: z.array(z.string()).min(2),
  answer: z.string(), // 正解（choices のいずれか）
  explain: z.string(), // 解説（回答後に表示）
});
export type Quiz = z.infer<typeof Quiz>;

// decode（解読）ステージ用。コードは実行せず、1 行を keyword / ( ) / { } に分解して読む訓練。
export const Decode = z.object({
  code: z.string(), // インタラクティブに分解表示するコード
  quiz: z.array(Quiz).default([]),
});
export type Decode = z.infer<typeof Decode>;

// learn（知る）ステージ用。教材は copy.prompt（左カラム）、演習はクイズ（右カラム）。
export const Learn = z.object({
  quiz: z.array(Quiz).min(1),
});
export type Learn = z.infer<typeof Learn>;

export const ProblemMeta = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  stage: Stage,
  scenario: Scenario,
  copy: Copy,
  // decode / learn は実行しないので空でよい
  initialCode: z.string().default(""),
  solutionCode: z.string().default(""),
  decode: Decode.optional(),
  learn: Learn.optional(),
});
export type ProblemMeta = z.infer<typeof ProblemMeta>;

export const defineProblem = (p: z.input<typeof ProblemMeta>): ProblemMeta =>
  ProblemMeta.parse(p);
