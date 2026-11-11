import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-types-sized-dst",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "?Sized で str やスライスも受け取る",
    prompt: `## やること（コンパイルエラーを直す問題）

初期コードの 3 つの関数は、中身はできているが **\`str\` や \`[T]\`（DST）を渡すとコンパイルエラー** になる。ジェネリクスの型引数には暗黙に \`Sized\` 境界が付いているからだ。

- \`debug_text<T: Debug>(x: &T) -> String\` … \`debug_text("hi")\` で \`T = str\` になれずにエラー
- \`byte_size<T>(x: &T) -> usize\` … \`std::mem::size_of_val\` で中身のバイト数を返す。\`byte_size("あいう")\` や \`byte_size(&[1u8, 2, 3][..])\` で使いたい
- \`Labeled<T>\` … \`label\` と \`Box<T>\` を持つ構造体。\`Labeled<str>\` や \`Labeled<[i32]>\` を作りたい

それぞれに **\`?Sized\`** を付けて、次がすべて動くようにしよう。

\`\`\`rust
debug_text("hi")                 // "\\"hi\\""
debug_text(&[1, 2][..])          // "[1, 2]"
byte_size("あいう")              // 9（UTF-8 で 1 文字 3 バイト）
byte_size(&[0u16; 4][..])        // 8
let l: Labeled<str> = Labeled { label: "name", value: Box::from("Ferris") };
l.describe()                     // "name: \\"Ferris\\""
\`\`\``,
    hints: [
      "`fn debug_text<T: Debug + ?Sized>(x: &T)` のように境界に `?Sized` を足す。",
      "境界が何もない `T` でも `T: ?Sized` と書ける。",
      "構造体は `struct Labeled<T: ?Sized>` と `impl<T: Debug + ?Sized> Labeled<T>` の両方に付ける。`Box<T>` は `T: ?Sized` を受け付ける。",
    ],
  },
  initialCode: `use std::fmt::Debug;

fn debug_text<T: Debug>(x: &T) -> String {
    format!("{:?}", x)
}

fn byte_size<T>(x: &T) -> usize {
    std::mem::size_of_val(x)
}

struct Labeled<T> {
    label: &'static str,
    value: Box<T>,
}

impl<T: Debug> Labeled<T> {
    fn describe(&self) -> String {
        format!("{}: {:?}", self.label, self.value)
    }
}
`,
  solutionCode: `use std::fmt::Debug;

fn debug_text<T: Debug + ?Sized>(x: &T) -> String {
    format!("{:?}", x)
}

fn byte_size<T: ?Sized>(x: &T) -> usize {
    std::mem::size_of_val(x)
}

struct Labeled<T: ?Sized> {
    label: &'static str,
    value: Box<T>,
}

impl<T: Debug + ?Sized> Labeled<T> {
    fn describe(&self) -> String {
        format!("{}: {:?}", self.label, self.value)
    }
}
`,
});
