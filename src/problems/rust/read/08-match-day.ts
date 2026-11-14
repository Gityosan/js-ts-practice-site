import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-match-day",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "match の値を変えて曜日を出す",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

\`day\` の数字を 1〜7 や 0、8 などに変えて、どの腕が実行されるか見よう。

## コードを読んでみよう

\`\`\`rust
let name = match day {
    1 => "月曜",
    2 => "火曜",
    6 | 7 => "週末",
    _ => "その他",
};
\`\`\`

- \`match\` は値をパターンと照らし合わせて分岐する
- \`6 | 7\` は「6 または 7」
- \`_\` は「それ以外ぜんぶ」
- \`3..=5\` のように **範囲** もパターンにできる

**試してみよう:** \`_ =>\` の行を消すと？ → 全パターンを網羅していないのでコンパイルエラー（E0004）。`,
    hints: [
      "`day` を 6 にすると「週末」",
      "`_ =>` を消すとコンパイルエラー",
      '`3..=5 => "平日の真ん中",` のような腕も書ける',
    ],
  },
  initialCode: `fn main() {
    let day = 3; // ← 数字を変えて ▶ 実行！
    let name = match day {
        1 => "月曜",
        2 => "火曜",
        3..=5 => "水〜金曜",
        6 | 7 => "週末",
        _ => "そんな曜日はない",
    };
    println!("{} → {}", day, name);
}
`,
  solutionCode: `fn main() {
    let day = 3; // ← 数字を変えて ▶ 実行！
    let name = match day {
        1 => "月曜",
        2 => "火曜",
        3..=5 => "水〜金曜",
        6 | 7 => "週末",
        _ => "そんな曜日はない",
    };
    println!("{} → {}", day, name);
}
`,
});
