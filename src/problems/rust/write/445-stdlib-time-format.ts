import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-stdlib-duration-format",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Duration と数値フォーマット",
    prompt: `## やること

### 1. \`hms(d: Duration) -> String\`

\`Duration\` を \`"時:分:秒"\` の形にする。分と秒は 2 桁ゼロ埋め、時は最低 2 桁。

\`\`\`rust
hms(Duration::from_secs(3725))   // "01:02:05"
hms(Duration::from_secs(360000)) // "100:00:00"
\`\`\`

\`d.as_secs()\` で秒数（\`u64\`）が取れる。

### 2. \`with_commas(n: u64) -> String\`

3 桁ごとにカンマを入れる。標準の書式にはないので自分で書く。

\`\`\`rust
with_commas(1234567) // "1,234,567"
with_commas(999)     // "999"
\`\`\`

### 3. \`total_time(laps: &[u64]) -> String\`

各ラップのミリ秒の配列を \`Duration::from_millis\` で足し合わせ、\`"{秒}.{ミリ秒 3 桁}s"\` の形にする（\`Duration\` は \`+\` や \`sum()\` で足せる）。

\`\`\`rust
total_time(&[1500, 2250, 300]) // "4.050s"
\`\`\`

\`as_secs()\` と \`subsec_millis()\` を使う。`,
    hints: [
      '`let s = d.as_secs(); format!("{:02}:{:02}:{:02}", s / 3600, s / 60 % 60, s % 60)`',
      "with_commas: 数字の文字列を後ろから見て、3 文字ごとに `,` を挟む（`chars().rev()` と `enumerate()`）",
      '`let total: Duration = laps.iter().map(|&ms| Duration::from_millis(ms)).sum(); format!("{}.{:03}s", total.as_secs(), total.subsec_millis())`',
    ],
  },
  initialCode: `use std::time::Duration;

fn hms(d: Duration) -> String {
    todo!()
}

fn with_commas(n: u64) -> String {
    todo!()
}

fn total_time(laps: &[u64]) -> String {
    todo!()
}
`,
  solutionCode: `use std::time::Duration;

fn hms(d: Duration) -> String {
    let s = d.as_secs();
    format!("{:02}:{:02}:{:02}", s / 3600, s / 60 % 60, s % 60)
}

fn with_commas(n: u64) -> String {
    let digits = n.to_string();
    let mut out = String::new();
    for (i, c) in digits.chars().rev().enumerate() {
        if i > 0 && i % 3 == 0 {
            out.push(',');
        }
        out.push(c);
    }
    out.chars().rev().collect()
}

fn total_time(laps: &[u64]) -> String {
    let total: Duration = laps.iter().map(|&ms| Duration::from_millis(ms)).sum();
    format!("{}.{:03}s", total.as_secs(), total.subsec_millis())
}
`,
});
