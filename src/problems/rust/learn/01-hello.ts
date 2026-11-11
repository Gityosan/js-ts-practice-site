import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-hello",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Rust とは / Hello, world!",
    prompt: `## Rust ってどんな言語？

Rust は **速さ（C/C++ 並み）** と **安全さ（メモリ破壊やデータ競合をコンパイル時に防ぐ）** を両立させた言語。
ガベージコレクタ（GC）を持たず、代わりに **所有権（ownership）** というルールでメモリを管理する。

| 特徴 | 中身 |
|---|---|
| コンパイル言語 | \`rustc\` が機械語に変換する。実行前に多くのミスを見つけてくれる |
| GC なし | メモリは「持ち主」がスコープを抜けた瞬間に解放される |
| 安全 | null 参照・解放後の使用・データ競合をコンパイルエラーにする |
| 表現力 | enum・パターンマッチ・トレイト・イテレータなど現代的な機能 |

## はじめてのプログラム

\`\`\`rust
fn main() {
    println!("Hello, world!");
}
\`\`\`

- **\`fn main()\`** … プログラムの入口。実行すると最初にここが呼ばれる
- **\`println!\`** … 末尾の \`!\` は **マクロ** の印（関数ではない）。1 行表示して改行する
- 文の終わりには **\`;\`** を付ける
- インデントは **スペース 4 つ** が標準（\`rustfmt\` が自動で整える）

## Cargo（カーゴ）

実際の開発では \`rustc\` を直接叩かず、ビルドツール兼パッケージマネージャの **Cargo** を使う。

\`\`\`bash
cargo new hello      # プロジェクト作成（src/main.rs と Cargo.toml ができる）
cargo run            # ビルドして実行
cargo build --release  # 最適化ビルド
cargo check          # コンパイルが通るかだけを高速に確認
\`\`\`

## このサイトでの実行

「書く」問題では、書いたコードを公式の **Rust Playground** に送ってコンパイル・実行し、結果で採点する。
コンパイルエラーが出たら、エラーコード（例: \`E0382\`）と日本語の説明を表示する。
**Rust ではコンパイラのエラーメッセージが最高の先生**。怖がらずに読もう。`,
    hints: [
      "`println!` の `!` はマクロの印。",
      "プログラムは `fn main()` から始まる。",
      "Cargo は Rust 公式のビルドツール兼パッケージマネージャ。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "Rust のプログラムで最初に実行される関数は？",
        choices: ["main", "start", "init", "run"],
        answer: "main",
        explain: "`fn main()` がエントリポイント（入口）。",
      },
      {
        prompt: "`println!` の末尾の `!` は何を表す？",
        snippet: `println!("Hello");`,
        choices: ["マクロであること", "強調表示", "否定（not）", "エラーを無視すること"],
        answer: "マクロであること",
        explain:
          "Rust では `名前!(...)` の形はマクロ呼び出し。可変個の引数や書式指定ができるのはマクロだから。",
      },
      {
        prompt: "Rust がメモリを管理する仕組みは？",
        choices: [
          "所有権（ownership）のルールで、持ち主がスコープを抜けたら解放",
          "ガベージコレクタが定期的に回収",
          "プログラマが毎回 free() を呼ぶ",
          "メモリは解放されない",
        ],
        answer: "所有権（ownership）のルールで、持ち主がスコープを抜けたら解放",
        explain: "GC も手動 free も使わず、コンパイル時に決まる所有権ルールで自動解放する。",
      },
      {
        prompt: "コンパイルが通るかどうかだけを素早く確認する Cargo のコマンドは？",
        choices: ["cargo check", "cargo run", "cargo new", "cargo publish"],
        answer: "cargo check",
        explain: "`cargo check` は実行ファイルを作らずに型検査・借用検査だけ行うので速い。",
      },
    ],
  },
});
