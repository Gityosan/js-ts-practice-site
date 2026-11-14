import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-decode-derive-enum",
  stage: "decode",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "#[derive] と enum のバリアント",
    prompt: `## 属性と列挙型

\`\`\`rust
#[derive(Debug, Clone, PartialEq)]
enum Shape {
    Circle(f64),
    Rect { w: f64, h: f64 },
    Empty,
}
\`\`\`

- \`#[derive(...)]\` … **属性**。直後の型に、トレイト（Debug 表示・複製・比較）の実装を自動で付ける
- \`enum 名前 { }\` … 候補（**バリアント**）のどれか 1 つになる型
- \`Circle(f64)\` … 値を 1 つ持つバリアント（タプル形式）
- \`Rect { w: f64, h: f64 }\` … 名前付きのフィールドを持つバリアント
- \`Empty\` … データを持たないバリアント
- 使うときは \`Shape::Circle(1.5)\` のように \`型名::バリアント\``,
    hints: [
      "`#[...]` は直後の要素への指示（属性）。",
      "バリアントの `( )` は値を包む、`{ }` は名前付きフィールド。",
      "`Shape::Circle` の `::` でバリアントを指す。",
    ],
  },
  decode: {
    code: `#[derive(Debug, Clone, PartialEq)]
enum Shape {
    Circle(f64),
    Rect { w: f64, h: f64 },
    Empty,
}

let s = Shape::Circle(1.5);`,
    quiz: [
      {
        prompt: "`#[derive(Debug)]` は何をする？",
        choices: [
          "Debug トレイトの実装を自動生成する",
          "デバッグモードで実行する",
          "コメントとして無視される",
        ],
        answer: "Debug トレイトの実装を自動生成する",
        explain: "これで `{:?}` で表示できるようになる。",
      },
      {
        prompt: "`Circle(f64)` の `( )` は何？",
        choices: ["バリアントが持つ値（f64 を 1 つ）", "関数の引数リスト", "関数の呼び出し"],
        answer: "バリアントが持つ値（f64 を 1 つ）",
        explain: "enum の中では `バリアント(型)` で値を持つバリアントを定義する。",
      },
      {
        prompt: "`Shape` の値は一度にいくつのバリアントになれる？",
        choices: ["どれか 1 つ", "全部同時に", "2 つまで"],
        answer: "どれか 1 つ",
        explain: "enum は候補のうちどれか 1 つを表す型。",
      },
      {
        prompt: "`Shape::Circle(1.5)` の `::` は何？",
        choices: ["Shape の中のバリアント Circle を指す", "型注釈", "範囲"],
        answer: "Shape の中のバリアント Circle を指す",
        explain: "`型名::バリアント` でバリアントを指定する。",
      },
    ],
  },
});
