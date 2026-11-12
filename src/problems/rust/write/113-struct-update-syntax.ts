import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-struct-update-syntax",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "フィールド初期化省略と構造体更新構文",
    prompt: `## やること

ゲームの設定 \`Config\` を扱う関数を 2 つ書こう。

\`\`\`rust
#[derive(Debug)]
struct Config {
    name: String,
    volume: u8,
    fullscreen: bool,
    difficulty: u8,
}
\`\`\`

- \`default_config(name: String) -> Config\` … 名前だけ受け取り、\`volume: 50, fullscreen: false, difficulty: 1\` で作る。**フィールド初期化省略記法**（\`name,\`）を使おう
- \`hard_mode(base: Config) -> Config\` … \`base\` をもとに **\`difficulty\` を 3、\`fullscreen\` を true** にした設定を返す。残りは **構造体更新構文 \`..base\`** で引き継ぐ

\`\`\`rust
let c = default_config(String::from("p1"));
// Config { name: "p1", volume: 50, fullscreen: false, difficulty: 1 }
hard_mode(c);
// Config { name: "p1", volume: 50, fullscreen: true, difficulty: 3 }
\`\`\`

\`..base\` は最後に書く。\`base\` を値で受け取っているので、name（String）のムーブも問題ない。`,
    hints: [
      "`Config { name, volume: 50, fullscreen: false, difficulty: 1 }`",
      "`Config { difficulty: 3, fullscreen: true, ..base }`",
    ],
  },
  initialCode: `#[derive(Debug)]
struct Config {
    name: String,
    volume: u8,
    fullscreen: bool,
    difficulty: u8,
}

fn default_config(name: String) -> Config {
    todo!()
}

fn hard_mode(base: Config) -> Config {
    todo!()
}
`,
  solutionCode: `#[derive(Debug)]
struct Config {
    name: String,
    volume: u8,
    fullscreen: bool,
    difficulty: u8,
}

fn default_config(name: String) -> Config {
    Config {
        name,
        volume: 50,
        fullscreen: false,
        difficulty: 1,
    }
}

fn hard_mode(base: Config) -> Config {
    Config {
        difficulty: 3,
        fullscreen: true,
        ..base
    }
}
`,
});
