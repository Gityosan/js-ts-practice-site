import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fmt-radix-precision",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "精度と 16 進・2 進を format! で作る",
    prompt: `## やること

\`format!\` を使って次の 3 つの関数を書こう（表示はせず \`String\` を返す）。

- \`price(yen: f64) -> String\` … 小数 2 桁、先頭に \`¥\`。例: \`price(1234.5)\` → \`"¥1234.50"\`
- \`color_hex(r: u8, g: u8, b: u8) -> String\` … \`#\` に続けて各色を **2 桁の大文字 16 進**（ゼロ埋め）。例: \`color_hex(255, 128, 0)\` → \`"#FF8000"\`
- \`bits(n: u8) -> String\` … \`0b\` 接頭辞付きで **8 桁の 2 進**。例: \`bits(5)\` → \`"0b00000101"\`

## 書式のおさらい

| 書式 | 意味 |
|---|---|
| \`{:.2}\` | 小数 2 桁 |
| \`{:02X}\` | 大文字 16 進・幅 2・ゼロ埋め |
| \`{:#010b}\` | \`0b\` 付き・全体の幅 10・ゼロ埋め |`,
    hints: [
      '`format!("¥{:.2}", yen)`',
      '`format!("#{:02X}{:02X}{:02X}", r, g, b)`',
      "`#` を付けると接頭辞の 2 文字も幅に含まれる。8 桁 + `0b` で幅 10",
    ],
  },
  initialCode: `fn price(yen: f64) -> String {
    todo!()
}

fn color_hex(r: u8, g: u8, b: u8) -> String {
    todo!()
}

fn bits(n: u8) -> String {
    todo!()
}
`,
  solutionCode: `fn price(yen: f64) -> String {
    format!("¥{:.2}", yen)
}

fn color_hex(r: u8, g: u8, b: u8) -> String {
    format!("#{:02X}{:02X}{:02X}", r, g, b)
}

fn bits(n: u8) -> String {
    format!("{:#010b}", n)
}
`,
});
