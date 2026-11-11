import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-const-define-use",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "const で定数を定義して使う",
    prompt: `## やること

ゲームの設定値を \`const\` で定義し、それを使う関数を書こう。

### 定数（値を正しく直す）

| 名前 | 型 | 値 |
|---|---|---|
| \`MAX_LEVEL\` | \`u32\` | \`99\` |
| \`EXP_PER_LEVEL\` | \`u32\` | \`250\` |
| \`MAX_EXP\` | \`u32\` | \`MAX_LEVEL * EXP_PER_LEVEL\`（定数式で計算する） |
| \`TITLE\` | \`&str\` | \`"Rust Quest"\` |

初期コードでは値が仮に \`0\` や \`""\` になっている。

### 関数

- \`level_of(exp: u32) -> u32\` … 経験値からレベルを計算する。\`exp / EXP_PER_LEVEL + 1\` だが、\`MAX_LEVEL\` を超えないようにする（\`.min(MAX_LEVEL)\`）
- \`banner() -> String\` … \`"Rust Quest (Lv.1-99)"\` のように、\`TITLE\` と \`MAX_LEVEL\` を埋め込んだ文字列を返す`,
    hints: [
      "`const MAX_EXP: u32 = MAX_LEVEL * EXP_PER_LEVEL;` のように定数の中で他の定数を使える",
      "`(exp / EXP_PER_LEVEL + 1).min(MAX_LEVEL)`",
      '`format!("{} (Lv.1-{})", TITLE, MAX_LEVEL)`',
    ],
  },
  initialCode: `const MAX_LEVEL: u32 = 0;
const EXP_PER_LEVEL: u32 = 0;
const MAX_EXP: u32 = 0;
const TITLE: &str = "";

fn level_of(exp: u32) -> u32 {
    todo!()
}

fn banner() -> String {
    todo!()
}
`,
  solutionCode: `const MAX_LEVEL: u32 = 99;
const EXP_PER_LEVEL: u32 = 250;
const MAX_EXP: u32 = MAX_LEVEL * EXP_PER_LEVEL;
const TITLE: &str = "Rust Quest";

fn level_of(exp: u32) -> u32 {
    (exp / EXP_PER_LEVEL + 1).min(MAX_LEVEL)
}

fn banner() -> String {
    format!("{} (Lv.1-{})", TITLE, MAX_LEVEL)
}
`,
});
