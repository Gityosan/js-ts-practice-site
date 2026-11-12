import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-default-trait",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Default の derive と手動実装",
    prompt: `## やること

### 1. derive(Default)

集計用の構造体 \`Stats\` に \`Default\` を derive しよう。全フィールドが既定値（0 / 空文字列）になる。

\`\`\`rust
Stats::default()  // Stats { count: 0, total: 0, label: "" }
\`\`\`

### 2. 手で Default を実装

設定 \`Config\` の既定値は自分で決めたいので、\`impl Default for Config\` を書こう。

| フィールド | 既定値 |
|---|---|
| \`name: String\` | \`"app"\` |
| \`port: u16\` | \`8080\` |
| \`verbose: bool\` | \`false\` |
| \`retries: u32\` | \`3\` |

### 3. 構造体更新構文と組み合わせる

\`dev_config() -> Config\` … port を \`3000\`、verbose を \`true\` にし、**残りは既定値**。\`..Default::default()\` を使おう。`,
    hints: [
      "Stats に `#[derive(Debug, Default)]`",
      '`impl Default for Config { fn default() -> Self { Config { name: String::from("app"), port: 8080, ... } } }`',
      "`Config { port: 3000, verbose: true, ..Default::default() }`",
    ],
  },
  initialCode: `// Stats に Default を derive しよう
#[derive(Debug)]
struct Stats {
    count: u32,
    total: i64,
    label: String,
}

#[derive(Debug)]
struct Config {
    name: String,
    port: u16,
    verbose: bool,
    retries: u32,
}

impl Default for Config {
    fn default() -> Self {
        todo!()
    }
}

fn dev_config() -> Config {
    todo!()
}
`,
  solutionCode: `#[derive(Debug, Default)]
struct Stats {
    count: u32,
    total: i64,
    label: String,
}

#[derive(Debug)]
struct Config {
    name: String,
    port: u16,
    verbose: bool,
    retries: u32,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            name: String::from("app"),
            port: 8080,
            verbose: false,
            retries: 3,
        }
    }
}

fn dev_config() -> Config {
    Config {
        port: 3000,
        verbose: true,
        ..Default::default()
    }
}
`,
});
