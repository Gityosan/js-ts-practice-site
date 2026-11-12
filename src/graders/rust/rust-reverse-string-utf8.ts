import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "ASCII", expr: 'reverse("hello")', expected: '"olleh"' },
    { label: "日本語", expr: 'reverse("こんにちは")', expected: '"はちにんこ"' },
    { label: "バイト数の違う文字が混在", expr: 'reverse("aé日")', expected: '"日éa"' },
    { label: "空文字", expr: 'reverse("")', expected: '""' },
    { label: "1 文字", expr: 'reverse("x")', expected: '"x"' },
  ],
};

export default grader;
