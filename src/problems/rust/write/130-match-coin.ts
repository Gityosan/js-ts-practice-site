import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-match-coin-value",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "match で硬貨の金額を数える",
    prompt: `## やること

日本の硬貨を表す enum \`Coin\` がある。記念硬貨 \`Commemorative\` だけは **額面（u32）** を持つ。

\`\`\`rust
enum Coin {
    One, Five, Ten, Fifty, Hundred, FiveHundred,
    Commemorative(u32),
}
\`\`\`

- \`value(coin: &Coin) -> u32\` … 硬貨の金額。記念硬貨は持っている額面
- \`total(coins: &[Coin]) -> u32\` … 合計金額
- \`is_hole(coin: &Coin) -> bool\` … 穴のあいた硬貨（5 円と 50 円）なら true。\`matches!\` を使ってみよう

\`\`\`rust
value(&Coin::FiveHundred);           // 500
value(&Coin::Commemorative(1000));   // 1000
total(&[Coin::Ten, Coin::One]);      // 11
\`\`\`

match は **全バリアントを書かないとコンパイルエラー** になる。どれか消して試してみよう。`,
    hints: [
      "`match coin { Coin::One => 1, Coin::Five => 5, ..., Coin::Commemorative(v) => *v }`",
      "total は for で value を足すか `coins.iter().map(value).sum()`",
      "`matches!(coin, Coin::Five | Coin::Fifty)`",
    ],
  },
  initialCode: `#[derive(Debug)]
enum Coin {
    One,
    Five,
    Ten,
    Fifty,
    Hundred,
    FiveHundred,
    Commemorative(u32),
}

fn value(coin: &Coin) -> u32 {
    todo!()
}

fn total(coins: &[Coin]) -> u32 {
    todo!()
}

fn is_hole(coin: &Coin) -> bool {
    todo!()
}
`,
  solutionCode: `#[derive(Debug)]
enum Coin {
    One,
    Five,
    Ten,
    Fifty,
    Hundred,
    FiveHundred,
    Commemorative(u32),
}

fn value(coin: &Coin) -> u32 {
    match coin {
        Coin::One => 1,
        Coin::Five => 5,
        Coin::Ten => 10,
        Coin::Fifty => 50,
        Coin::Hundred => 100,
        Coin::FiveHundred => 500,
        Coin::Commemorative(v) => *v,
    }
}

fn total(coins: &[Coin]) -> u32 {
    let mut sum = 0;
    for c in coins {
        sum += value(c);
    }
    sum
}

fn is_hole(coin: &Coin) -> bool {
    matches!(coin, Coin::Five | Coin::Fifty)
}
`,
});
