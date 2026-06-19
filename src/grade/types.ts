import type { z } from "zod";

export type IoCase = {
  label?: string;
  input: unknown[];
  expected: unknown;
  epsilon?: number;
  unordered?: boolean;
  skipValueCheck?: boolean; // read ステージ用: スキーマ合格で OK、値は問わない
};

export type IoGraderDef = {
  kind: "io";
  entry?: string;
  outputSchema?: z.ZodType;
  cases: IoCase[];
  assertMethod?: string; // 練習帳用: 学習者コードが指定メソッドを呼んでいるか確認 (例: "map", "filter")
  bonusCases?: { label: string; pattern: string }[]; // 裏回答検出: パターンにマッチしたら bonus フラグ付きで結果に追加
};

export type StateAssert = {
  label: string;
  check: (scope: Record<string, unknown>) => boolean;
};

export type StateGraderDef = {
  kind: "state";
  setupMocks: () => Record<string, unknown>;
  asserts: StateAssert[];
};

export type GraderDef = IoGraderDef | StateGraderDef;

export type CaseResult = { label: string; passed: boolean; detail?: string; output?: unknown; bonus?: boolean };

export type GradeResult = {
  passed: number;
  total: number;
  results: CaseResult[];
  status: "ok" | "timeout" | "error";
  error?: string;
};
