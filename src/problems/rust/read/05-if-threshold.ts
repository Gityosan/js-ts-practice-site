import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-if-threshold",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "温度を変えて分岐を確かめる",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

\`temp\` の数字を変えて、表示されるメッセージがどう変わるか見よう。

## コードを読んでみよう

\`\`\`rust
let advice = if temp >= 30 {
    "暑い！水分をとろう"
} else if temp >= 15 {
    "ちょうどいい"
} else {
    "寒い！上着を着よう"
};
\`\`\`

- Rust の \`if\` は条件を \`( )\` で囲まない
- \`if\` は **値を返す式**。分岐の最後の値が \`advice\` に入る
- 上から順に判定して、最初に真になった分岐だけ実行される

**試してみよう:** 30・15・14 など境目の数字を入れて確かめよう。`,
    hints: [
      "`temp` を 35 / 20 / 5 に変えてみよう",
      "境目（30 や 15）ちょうどのときはどうなる？",
      "`>=` を `>` に変えると境目の結果が変わる",
    ],
  },
  initialCode: `fn main() {
    let temp = 22; // ← 温度を変えて ▶ 実行！
    let advice = if temp >= 30 {
        "暑い！水分をとろう"
    } else if temp >= 15 {
        "ちょうどいい"
    } else {
        "寒い！上着を着よう"
    };
    println!("気温 {}℃: {}", temp, advice);
}
`,
  solutionCode: `fn main() {
    let temp = 22; // ← 温度を変えて ▶ 実行！
    let advice = if temp >= 30 {
        "暑い！水分をとろう"
    } else if temp >= 15 {
        "ちょうどいい"
    } else {
        "寒い！上着を着よう"
    };
    println!("気温 {}℃: {}", temp, advice);
}
`,
});
