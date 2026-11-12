import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-tuple-struct-color",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "タプル構造体: Color と Meters",
    prompt: `## やること

タプル構造体を 2 つ使う。

\`\`\`rust
#[derive(Debug)]
struct Color(u8, u8, u8);   // R, G, B
#[derive(Debug)]
struct Meters(f64);         // ニュータイプ（1 要素のタプル構造体）
\`\`\`

- \`Color\` のメソッド \`invert(&self) -> Color\` … 各成分を \`255 - 成分\` にした色を返す
- \`Color\` のメソッド \`to_hex(&self) -> String\` … \`"#ff8000"\` のような小文字 16 進 6 桁の文字列
- 関数 \`total(distances: &[Meters]) -> Meters\` … 距離の合計

- タプル構造体のフィールドは \`self.0\`, \`self.1\` のように番号でアクセス
- 2 桁の 16 進は \`format!("{:02x}", n)\``,
    hints: [
      "`Color(255 - self.0, 255 - self.1, 255 - self.2)`",
      '`format!("#{:02x}{:02x}{:02x}", self.0, self.1, self.2)`',
      "合計は `Meters(distances.iter().map(|m| m.0).sum())` か for ループ",
    ],
  },
  initialCode: `#[derive(Debug)]
struct Color(u8, u8, u8);

#[derive(Debug)]
struct Meters(f64);

impl Color {
    fn invert(&self) -> Color {
        todo!()
    }

    fn to_hex(&self) -> String {
        todo!()
    }
}

fn total(distances: &[Meters]) -> Meters {
    todo!()
}
`,
  solutionCode: `#[derive(Debug)]
struct Color(u8, u8, u8);

#[derive(Debug)]
struct Meters(f64);

impl Color {
    fn invert(&self) -> Color {
        Color(255 - self.0, 255 - self.1, 255 - self.2)
    }

    fn to_hex(&self) -> String {
        format!("#{:02x}{:02x}{:02x}", self.0, self.1, self.2)
    }
}

fn total(distances: &[Meters]) -> Meters {
    let mut sum = 0.0;
    for m in distances {
        sum += m.0;
    }
    Meters(sum)
}
`,
});
