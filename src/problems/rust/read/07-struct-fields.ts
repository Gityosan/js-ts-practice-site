import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-struct-fields",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "構造体のフィールドを変えて面積を見る",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

\`width\` と \`height\` の数字を変えて、面積と「正方形かどうか」の表示を確かめよう。

## コードを読んでみよう

\`\`\`rust
struct Rect {
    width: u32,
    height: u32,
}

impl Rect {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}
\`\`\`

- \`struct\` で「幅と高さ」をひとまとめにした型を作る
- \`impl\` の中の \`fn area(&self)\` は **メソッド**。\`rect.area()\` で呼ぶ
- \`#[derive(Debug)]\` を付けると \`{:?}\` で中身を表示できる

**試してみよう:** \`width\` に \`-3\` を入れると？ → \`u32\`（負の数なし）なのでコンパイルエラー。`,
    hints: [
      "`width: 3, height: 3` にすると正方形になる",
      "`{:#?}` にすると見やすく改行して表示される",
      "負の数は u32 に入らない",
    ],
  },
  initialCode: `#[derive(Debug)]
struct Rect {
    width: u32,
    height: u32,
}

impl Rect {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn is_square(&self) -> bool {
        self.width == self.height
    }
}

fn main() {
    let rect = Rect { width: 4, height: 3 }; // ← 数字を変えて ▶ 実行！
    println!("{:?}", rect);
    println!("面積: {}", rect.area());
    println!("正方形？ {}", rect.is_square());
}
`,
  solutionCode: `#[derive(Debug)]
struct Rect {
    width: u32,
    height: u32,
}

impl Rect {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn is_square(&self) -> bool {
        self.width == self.height
    }
}

fn main() {
    let rect = Rect { width: 4, height: 3 }; // ← 数字を変えて ▶ 実行！
    println!("{:?}", rect);
    println!("面積: {}", rect.area());
    println!("正方形？ {}", rect.is_square());
}
`,
});
