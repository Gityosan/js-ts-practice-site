import type { z } from "zod";
import type { VisualState } from "./visual";

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
  // 視覚出力: 先頭ケースの入力・出力から scenario の絵を作る（読み終わったら消す）
  visualize?: (output: unknown, input: unknown[]) => VisualState;
};

export type StateAssert = {
  label: string;
  check: (scope: Record<string, unknown>) => boolean;
};

export type StateGraderDef = {
  kind: "state";
  setupMocks: () => Record<string, unknown>;
  asserts: StateAssert[];
  bonusCases?: { label: string; pattern: string }[];
  // 視覚出力: 学習者コード実行後の scope（スパイ記録・モック状態）から scenario の絵を作る
  visualize?: (scope: Record<string, unknown>) => VisualState;
};

export type GraderDef = IoGraderDef | StateGraderDef;

export type CaseResult = { label: string; passed: boolean; detail?: string; output?: unknown; bonus?: boolean };

export type GradeResult = {
  passed: number;
  total: number;
  results: CaseResult[];
  status: "ok" | "timeout" | "error";
  error?: string;
  visual?: VisualState; // scenario の視覚出力（あれば）
};
