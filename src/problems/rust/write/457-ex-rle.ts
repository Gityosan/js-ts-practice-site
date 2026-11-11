import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ex-run-length",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "総合: ランレングス圧縮と展開",
    prompt: `## やること

同じ文字の連続を「回数 + 文字」で表す **ランレングス圧縮** を実装しよう。

### \`encode(s: &str) -> String\`

\`\`\`rust
encode("aaabcc")        // "3a1b2c"
encode("ああいいい")     // "2あ3い"
encode("")              // ""
\`\`\`

### \`decode(s: &str) -> Result<String, String>\`

\`encode\` の逆。回数は **2 桁以上** のこともある（\`"12x"\` → \`x\` が 12 個）。

| 状況 | 結果 |
|---|---|
| 正しい形式 | \`Ok(展開した文字列)\` |
| 回数の前に文字がある（例 \`"a3b"\` の先頭 \`a\`） | \`Err("回数がありません")\` |
| 回数の後に文字がない（例 \`"3a4"\`） | \`Err("文字がありません")\` |
| 回数が 0（例 \`"0a"\`） | \`Err("回数が 0 です")\` |

\`encode\` してから \`decode\` すると元に戻る（ただし元の文字列に数字が含まれない場合）。`,
    hints: [
      "encode: `chars().peekable()` を使い、同じ文字が続く間 `next()` して数える。または `let mut prev: Option<(char, usize)>` で前の文字と回数を持つ",
      "decode: 数字なら `count = count * 10 + d` で溜め、数字以外なら `count` 個 push して `count` を戻す。`c.to_digit(10)` で数字判定と変換ができる",
      "数字を 1 つも読んでいないのに文字が来たら「回数がありません」。最後に数字が溜まったままなら「文字がありません」",
    ],
  },
  initialCode: `fn encode(s: &str) -> String {
    todo!()
}

fn decode(s: &str) -> Result<String, String> {
    todo!()
}
`,
  solutionCode: `fn encode(s: &str) -> String {
    let mut out = String::new();
    let mut chars = s.chars().peekable();
    while let Some(c) = chars.next() {
        let mut n = 1;
        while chars.peek() == Some(&c) {
            chars.next();
            n += 1;
        }
        out.push_str(&format!("{n}{c}"));
    }
    out
}

fn decode(s: &str) -> Result<String, String> {
    let mut out = String::new();
    let mut count: Option<usize> = None;
    for c in s.chars() {
        if let Some(d) = c.to_digit(10) {
            count = Some(count.unwrap_or(0) * 10 + d as usize);
        } else {
            let n = count.ok_or("回数がありません".to_string())?;
            if n == 0 {
                return Err("回数が 0 です".to_string());
            }
            for _ in 0..n {
                out.push(c);
            }
            count = None;
        }
    }
    if count.is_some() {
        return Err("文字がありません".to_string());
    }
    Ok(out)
}
`,
});
