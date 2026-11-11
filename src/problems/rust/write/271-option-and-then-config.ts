import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-option-and-then-config",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "and_then / filter のチェーンで設定値を取り出す",
    prompt: `## やること

設定は \`(キー, 値)\` の配列で与えられる。値を取り出す関数 \`lookup\` は用意してある。

\`\`\`rust
let cfg = [("port", "3000"), ("timeout", "5"), ("name", " app ")];
\`\`\`

**Option のチェーン** で次の関数を書こう。

| 関数 | やること | 既定値 |
|---|---|---|
| \`port(cfg) -> u16\` | "port" を u16 として読む。**1024 未満は無効** | \`8080\` |
| \`timeout_ms(cfg) -> Option<u64>\` | "timeout"（秒）を u64 で読み、ミリ秒（× 1000）にする | 読めなければ \`None\` |
| \`app_name(cfg) -> String\` | "name" の前後の空白を除いたもの。**空文字列なら無効** | \`"unknown"\` |

- \`and_then(|s| s.parse().ok())\` … 数として読めなければ None
- \`filter(|&p| p >= 1024)\` … 条件を満たさなければ None
- \`map(...)\` … 変換
- 途中のどこで None になっても最後の \`unwrap_or\` に行く`,
    hints: [
      '`lookup(cfg, "port").and_then(|s| s.parse::<u16>().ok()).filter(|&p| p >= 1024).unwrap_or(8080)`',
      '`lookup(cfg, "timeout").and_then(|s| s.parse::<u64>().ok()).map(|s| s * 1000)`',
      '`lookup(cfg, "name").map(|s| s.trim()).filter(|s| !s.is_empty()).unwrap_or("unknown").to_string()`',
    ],
  },
  initialCode: `fn lookup<'a>(cfg: &[(&str, &'a str)], key: &str) -> Option<&'a str> {
    cfg.iter().find(|(k, _)| *k == key).map(|(_, v)| *v)
}

fn port(cfg: &[(&str, &str)]) -> u16 {
    todo!()
}

fn timeout_ms(cfg: &[(&str, &str)]) -> Option<u64> {
    todo!()
}

fn app_name(cfg: &[(&str, &str)]) -> String {
    todo!()
}
`,
  solutionCode: `fn lookup<'a>(cfg: &[(&str, &'a str)], key: &str) -> Option<&'a str> {
    cfg.iter().find(|(k, _)| *k == key).map(|(_, v)| *v)
}

fn port(cfg: &[(&str, &str)]) -> u16 {
    lookup(cfg, "port")
        .and_then(|s| s.parse::<u16>().ok())
        .filter(|&p| p >= 1024)
        .unwrap_or(8080)
}

fn timeout_ms(cfg: &[(&str, &str)]) -> Option<u64> {
    lookup(cfg, "timeout")
        .and_then(|s| s.parse::<u64>().ok())
        .map(|s| s * 1000)
}

fn app_name(cfg: &[(&str, &str)]) -> String {
    lookup(cfg, "name")
        .map(|s| s.trim())
        .filter(|s| !s.is_empty())
        .unwrap_or("unknown")
        .to_string()
}
`,
});
