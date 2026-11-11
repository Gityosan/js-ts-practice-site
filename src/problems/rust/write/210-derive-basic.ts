import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-derive-basic",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "derive で Debug / Clone / Copy / PartialEq / Default",
    prompt: `## やること

色を表す構造体 \`Color\` に **derive** を付けて、次の操作ができるようにしよう。

\`\`\`rust
struct Color { r: u8, g: u8, b: u8 }
\`\`\`

| やりたいこと | 必要なトレイト |
|---|---|
| \`{:?}\` で表示（採点で使う） | \`Debug\` |
| \`a == b\` で比較 | \`PartialEq\` |
| \`let b = a;\` の後も a を使う | \`Copy\`（と \`Clone\`） |
| \`Color::default()\` で黒 \`(0, 0, 0)\` | \`Default\` |

さらに、色を反転する関数を書こう（各成分を \`255 - 値\` にする）。

\`\`\`rust
fn invert(c: Color) -> Color
invert(Color { r: 255, g: 0, b: 100 })  // Color { r: 0, g: 255, b: 155 }
\`\`\`

初期コードは derive が足りないので、採点用の式（\`==\` や \`{:?}\` を使う）がコンパイルできない。derive を足すところから始めよう。`,
    hints: [
      "構造体の直前に `#[derive(Debug, Clone, Copy, PartialEq, Default)]`",
      "Copy を付けるには Clone も必要",
      "invert は `Color { r: 255 - c.r, g: 255 - c.g, b: 255 - c.b }`",
    ],
  },
  initialCode: `// 必要な derive を足そう
struct Color {
    r: u8,
    g: u8,
    b: u8,
}

fn invert(c: Color) -> Color {
    todo!()
}
`,
  solutionCode: `#[derive(Debug, Clone, Copy, PartialEq, Default)]
struct Color {
    r: u8,
    g: u8,
    b: u8,
}

fn invert(c: Color) -> Color {
    Color { r: 255 - c.r, g: 255 - c.g, b: 255 - c.b }
}
`,
});
