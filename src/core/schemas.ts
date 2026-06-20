import { z } from "zod";

export const Stage = z.enum(["decode", "read", "tweak", "fill", "write"]);
export type Stage = z.infer<typeof Stage>;

export const Scenario = z.enum(["basic", "data", "gas", "email", "chrome"]);
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

// decode（解読）ステージ用。コードは実行せず、1 行を keyword / ( ) / { } に分解して読む訓練。
// quiz は「答えを出さず段階的に詰まらせる」装置（SPEC §0）。snippet にその設問対象を載せる。
const DecodeQuiz = z.object({
  prompt: z.string(), // 設問（markdown 可）
  snippet: z.string().optional(), // 設問対象のコード片（ハイライト表示）
  choices: z.array(z.string()).min(2),
  answer: z.string(), // 正解（choices のいずれか）
  explain: z.string(), // 解説（回答後に表示）
});
export const Decode = z.object({
  code: z.string(), // インタラクティブに分解表示するコード
  quiz: z.array(DecodeQuiz).default([]),
});
export type Decode = z.infer<typeof Decode>;

export const ProblemMeta = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  stage: Stage,
  scenario: Scenario,
  copy: Copy,
  // decode は実行しないので空でよい
  initialCode: z.string().default(""),
  solutionCode: z.string().default(""),
  tweak: Tweak.optional(),
  decode: Decode.optional(),
});
export type ProblemMeta = z.infer<typeof ProblemMeta>;

export const defineProblem = (p: z.input<typeof ProblemMeta>): ProblemMeta =>
  ProblemMeta.parse(p);
