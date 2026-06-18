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

export const ProblemMeta = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  stage: Stage,
  scenario: Scenario,
  copy: Copy,
  initialCode: z.string(),
  solutionCode: z.string(),
});
export type ProblemMeta = z.infer<typeof ProblemMeta>;

export const defineProblem = (p: ProblemMeta): ProblemMeta => ProblemMeta.parse(p);
