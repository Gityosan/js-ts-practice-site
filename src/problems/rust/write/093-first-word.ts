import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-first-word",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "最初の単語を &str で返す（first_word）",
    prompt: `## やること

文字列スライスを受け取り、**最初のスペース（\`' '\`）より前の部分** を返す関数 \`first_word\` を書こう。スペースがなければ文字列全体を返す。

\`\`\`rust
first_word("hello world")   // "hello"
first_word("rust")          // "rust"
first_word(" lead")         // ""（先頭がスペース）
first_word("")              // ""
\`\`\`

## ポイント

戻り値の \`&str\` は **元の文字列の一部を指すスライス**。新しい String は作らない。

\`\`\`rust
let bytes = s.as_bytes();                 // &[u8]（バイトのスライス）
for (i, &b) in bytes.iter().enumerate() { // i: 添字, b: そのバイト
    if b == b' ' {                        // b' ' はスペースのバイト値
        // ここで &s[..i] を返す
    }
}
\`\`\`

- \`enumerate()\` は \`(添字, 要素)\` の組を順に返す
- スペースは 1 バイトの ASCII なので、その位置で切っても UTF-8 の境界を壊さない（日本語を含んでいても安全）
- （\`s.split(' ').next()\` や \`s.find(' ')\` でも書けるので、慣れたら試してみよう）`,
    hints: ["`if b == b' ' { return &s[..i]; }`", "ループを抜けたら `s` をそのまま返す"],
  },
  initialCode: `fn first_word(s: &str) -> &str {
    todo!()
}
`,
  solutionCode: `fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            return &s[..i];
        }
    }
    s
}
`,
});
