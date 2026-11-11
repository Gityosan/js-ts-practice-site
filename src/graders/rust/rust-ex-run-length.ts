import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    { label: "圧縮", expr: 'encode("aaabcc")', expected: '"3a1b2c"' },
    { label: "日本語と空", expr: '(encode("ああいいい"), encode(""))', expected: '("2あ3い", "")' },
    { label: "展開（2 桁の回数）", expr: 'decode("12x1y")', expected: 'Ok("xxxxxxxxxxxxy")' },
    {
      label: "往復で元に戻る",
      expr: 'decode(&encode("hello  world!!!"))',
      expected: 'Ok("hello  world!!!")',
    },
    { label: "回数がない", expr: 'decode("a3b")', expected: 'Err("回数がありません")' },
    { label: "文字がない", expr: 'decode("3a4")', expected: 'Err("文字がありません")' },
    { label: "回数 0", expr: 'decode("0a")', expected: 'Err("回数が 0 です")' },
  ],
};

export default grader;
