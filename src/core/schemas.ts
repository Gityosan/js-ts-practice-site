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

const IoGrader = z.object({
  kind: z.literal("io"),
  entry: z.string().default("solve"),
  outputSchema: z.custom<z.ZodType>().optional(),
  cases: z
    .array(
      z.object({
        input: z.array(z.unknown()),
        expected: z.unknown(),
        epsilon: z.number().optional(),
        unordered: z.boolean().optional(),
      }),
    )
    .min(1),
});
export type IoGrader = z.infer<typeof IoGrader>;

const StateGrader = z.object({
  kind: z.literal("state"),
  setupMocks: z.custom<() => Record<string, unknown>>(),
  asserts: z
    .array(
      z.object({
        label: z.string(),
        check: z.custom<(scope: Record<string, unknown>) => boolean>(),
      }),
    )
    .min(1),
});
export type StateGrader = z.infer<typeof StateGrader>;

export const Grader = z.discriminatedUnion("kind", [IoGrader, StateGrader]);
export type Grader = z.infer<typeof Grader>;

export const Problem = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  stage: Stage,
  scenario: Scenario,
  copy: Copy,
  initialCode: z.string(),
  solutionCode: z.string(),
  grader: Grader,
});
export type Problem = z.infer<typeof Problem>;

export const defineProblem = (p: Problem): Problem => Problem.parse(p);

export type CaseResult = {
  index: number;
  passed: boolean;
  output?: unknown;
  error?: string;
};

export type AssertResult = {
  index: number;
  label: string;
  passed: boolean;
  error?: string;
};

export type GraderResult = {
  passed: number;
  total: number;
  timedOut?: boolean;
  schemaError?: string;
  results: (CaseResult | AssertResult)[];
};
