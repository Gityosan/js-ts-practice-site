import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-decode-use-path",
  stage: "decode",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "use と :: のパス、関連関数",
    prompt: `## 標準ライブラリの道具を取り込む

\`\`\`rust
use std::collections::HashMap;

let mut scores: HashMap<String, i32> = HashMap::new();
scores.insert(String::from("Alice"), 90);
\`\`\`

- \`use std::collections::HashMap;\` … \`std\`（標準ライブラリ）→ \`collections\` → \`HashMap\` という **パス** を取り込む。以後 \`HashMap\` だけで書ける
- \`::\` は **パスの区切り**（フォルダの \`/\` のようなもの）
- \`HashMap<String, i32>\` … キーが String、値が i32 の HashMap（ジェネリクス）
- \`HashMap::new()\` … **関連関数**（インスタンスを作る、いわゆるコンストラクタ）。\`型::関数\` で呼ぶ
- \`scores.insert(...)\` … **メソッド**。\`値.メソッド\` で呼ぶ`,
    hints: [
      "`::` は型やモジュールの中身を指す。",
      "`.` はインスタンスのメソッドやフィールド。",
      "`use` で長いパスを短く書けるようにする。",
    ],
  },
  decode: {
    code: `use std::collections::HashMap;

let mut scores: HashMap<String, i32> = HashMap::new();
scores.insert(String::from("Alice"), 90);`,
    quiz: [
      {
        prompt: "`use` の行は何をしている？",
        choices: [
          "HashMap という名前を短く使えるよう取り込む",
          "HashMap を新しく定義する",
          "ファイルを読み込んで実行する",
        ],
        answer: "HashMap という名前を短く使えるよう取り込む",
        explain: "`use` はパスを取り込むだけ。値は作らない。",
      },
      {
        prompt: "`HashMap::new()` と `scores.insert(...)` の違いは？",
        choices: [
          "`::` は型の関連関数、`.` はインスタンスのメソッド",
          "どちらも同じ",
          "`::` はメソッド、`.` はパス",
        ],
        answer: "`::` は型の関連関数、`.` はインスタンスのメソッド",
        explain: "new は型に属する関数（値をまだ持っていない）、insert は値に対するメソッド。",
      },
      {
        prompt: "`HashMap<String, i32>` の意味は？",
        choices: [
          "キーが String、値が i32",
          "String と i32 を比較する",
          "String を i32 に変換する",
        ],
        answer: "キーが String、値が i32",
        explain: "`< >` の中はジェネリクスの型引数。HashMap<キーの型, 値の型>。",
      },
      {
        prompt: "`std` は何？",
        choices: ["Rust の標準ライブラリ", "自分で付けた変数名", "予約語の一種"],
        answer: "Rust の標準ライブラリ",
        explain: "`std` は標準ライブラリのクレート名。`std::collections` はその中のモジュール。",
      },
    ],
  },
});
