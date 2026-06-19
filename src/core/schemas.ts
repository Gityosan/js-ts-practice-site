import { z } from "zod";

export const Stage = z.enum(["read", "tweak", "fill", "write"]);
export type Stage = z.infer<typeof Stage>;

export const Scenario = z.enum(["data", "gas", "email", "chrome"]);
export type Scenario = z.infer<typeof Scenario>;

const Copy = z.object({
  title: z.string(),
  prompt: z.string(),
  hints: z.array(z.string()).default([]),
});

// tweak（いじる）ステージ用の UI メタ。組み立て結果は実行可能な JS。
// parsons: 行を正しい順に並べ替える（lines は正解順、表示時にシャッフル）
const ParsonsTweak = z.object({
  kind: z.literal("parsons"),
  lines: z.array(z.string()).min(2),
});
// choice: テンプレートの {{0}} {{1}} … を選択肢から埋める（1.3 のキーワード弁別）
const ChoiceTweak = z.object({
  kind: z.literal("choice"),
  template: z.string(),
  blanks: z
    .array(
      z.object({
        choices: z.array(z.string()).min(2),
        answer: z.string(), // 正解（ヒント表示用・採点は振る舞いで判定）
      }),
    )
    .min(1),
});
export const Tweak = z.discriminatedUnion("kind", [ParsonsTweak, ChoiceTweak]);
export type Tweak = z.infer<typeof Tweak>;

export const ProblemMeta = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  stage: Stage,
  scenario: Scenario,
  copy: Copy,
  initialCode: z.string(),
  solutionCode: z.string(),
  tweak: Tweak.optional(),
});
export type ProblemMeta = z.infer<typeof ProblemMeta>;

export const defineProblem = (p: ProblemMeta): ProblemMeta => ProblemMeta.parse(p);
