import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-decode-struct-impl",
  stage: "decode",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "struct と impl：データとメソッドの骨格",
    prompt: `## 構造体の定義とメソッド

\`\`\`rust
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn sum(&self) -> i32 {
        self.x + self.y
    }
}
\`\`\`

- \`struct 名前 { }\` の中は \`フィールド名: 型,\`
- \`impl 名前 { }\` の中に、その型のメソッドを書く
- メソッドの最初の引数 \`&self\` は「自分自身を借りる」。\`self.x\` で自分のフィールドを読む
- 型の名前は大文字始まり（\`Point\`）、関数・フィールドは小文字（\`sum\`, \`x\`）が慣習`,
    hints: [
      "`struct` の `{ }` は定義、`impl` の `{ }` はメソッドを入れる箱。",
      "`&self` の `&` は借用。",
      "`self.x` の `.` はフィールドへのアクセス。",
    ],
  },
  decode: {
    code: `struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn sum(&self) -> i32 {
        self.x + self.y
    }
}`,
    quiz: [
      {
        prompt: "`struct Point { ... }` の `{ }` の中に並んでいるのは？",
        choices: ["フィールド（名前: 型）", "メソッド", "処理の文"],
        answer: "フィールド（名前: 型）",
        explain: "構造体の定義本体にはフィールドを `名前: 型,` で並べる。",
      },
      {
        prompt: "`impl Point { ... }` の役割は？",
        choices: ["Point にメソッドを実装する", "Point を継承する", "Point の値を作る"],
        answer: "Point にメソッドを実装する",
        explain: "impl ブロックの中に、その型のメソッド（fn）を書く。",
      },
      {
        prompt: "`&self` は何を表す？",
        snippet: `fn sum(&self) -> i32 {`,
        choices: [
          "自分自身（このインスタンス）を借りる",
          "自分自身を捨てる",
          "新しい Point を作る",
        ],
        answer: "自分自身（このインスタンス）を借りる",
        explain: "`&self` は自分を不変で借りる。所有権は移らないので、呼んだ後も使い続けられる。",
      },
      {
        prompt: "`Point` と `x` はそれぞれ予約語？ 自分で付けた名前？",
        choices: ["どちらも自分で付けた名前", "どちらも予約語", "Point だけ予約語"],
        answer: "どちらも自分で付けた名前",
        explain: "型名もフィールド名も自分で付けた名前。予約語は struct / impl / fn / self。",
      },
    ],
  },
});
