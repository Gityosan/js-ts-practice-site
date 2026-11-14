import type { RustGraderDef } from "../../grade/types";

// 数字や文字列は自由に変えてよいので、コンパイルして最後まで実行できれば OK。
// 出力は「出力プレビュー」にそのまま表示する。
const grader: RustGraderDef = {
  kind: "rust",
  mode: "stdout",
  cases: [{ label: "最後まで実行できた", expected: "", skipValueCheck: true }],
};

export default grader;
