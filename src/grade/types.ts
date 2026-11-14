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

// cli（CLI 実行）ステージ用。学習者が書いたコマンド（jq フィルタ等）を本物の WASM で
// 実行し、標準出力を expected と突き合わせる。io の stdin/stdout 版。
export type CliCase = {
  label?: string;
  stdin: unknown; // jq に渡す入力（JS の値ならシリアライズ、文字列なら生 JSON として解釈）
  args?: string[]; // 追加フラグ（例: ["-r"] で raw 出力）
  expected: string; // 期待する標準出力（末尾改行は正規化して比較）
  skipValueCheck?: boolean; // read ステージ用: 正常終了（exit 0）すれば OK、出力の中身は問わない
};

export type CliGraderDef = {
  kind: "cli";
  // "jq": jq-wasm（npm 同梱・SAB 不要・Worker で実行）
  // "sh": @wasmer/sdk で本物のシェルを実行（cross-origin isolation 必須・メインスレッドで実行）
  runtime: "jq" | "sh";
  cases: CliCase[];
  bonusCases?: { label: string; pattern: string }[];
};

// rust ステージ用。学習者の Rust コードを本物の rustc でコンパイル・実行して採点する。
// ブラウザでは公式の Rust Playground（play.rust-lang.org）、Node/CI ではローカルの rustc を使う。
//
// - "harness": 学習者は関数・構造体などを書く（fn main は書かない）。採点側が main を
//   付け足し、各ケースの式 `expr` を評価して `{:?}`（Debug 表示）を expected と比べる。
//   1 回のコンパイルで全ケースを実行し、ケースごとに panic を捕まえて部分点を残す。
// - "stdout": 学習者が fn main を含むプログラム全体を書き、標準出力を expected と比べる。
export type RustHarnessCase = {
  label?: string;
  expr: string; // Rust の式。例: `add(2, 3)` / `{ let mut v = vec![3, 1]; sort_desc(&mut v); v }`
  expected: string; // 式の結果を `{:?}` で表示した文字列。例: `5` / `"hello"` / `[3, 1]`
};

export type RustStdoutCase = {
  label?: string;
  expected: string; // 期待する標準出力（行末の空白と末尾改行は正規化して比較）
  // read ステージ用: コンパイルして最後まで実行できれば OK（出力の中身は問わない）。
  // 学習者が数字などを自由に変えて出力の変化を見る問題で使う。
  skipValueCheck?: boolean;
};

export type RustGraderDef =
  | { kind: "rust"; mode: "harness"; cases: RustHarnessCase[] }
  | { kind: "rust"; mode: "stdout"; cases: RustStdoutCase[] };

export type GraderDef = IoGraderDef | StateGraderDef | CliGraderDef | RustGraderDef;

export type CaseResult = {
  label: string;
  passed: boolean;
  detail?: string;
  output?: unknown;
  bonus?: boolean;
};

export type GradeResult = {
  passed: number;
  total: number;
  results: CaseResult[];
  status: "ok" | "timeout" | "error";
  error?: string;
  visual?: VisualState; // scenario の視覚出力（あれば）
};
