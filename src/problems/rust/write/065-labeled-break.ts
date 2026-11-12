import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-labeled-break",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ラベル付き break で二重ループを抜ける",
    prompt: `## やること

九九の表（1〜9 × 1〜9）を \`a\` の小さい順、同じ \`a\` の中では \`b\` の小さい順に調べ、
**\`a * b == target\` となる最初の組 \`(a, b)\`** を返す関数 \`find_factors\` を書こう。見つからなければ \`(0, 0)\`。

\`\`\`rust
find_factors(12)   // (2, 6)  … (1, 12) は b が 9 を超えるので対象外
find_factors(7)    // (1, 7)
find_factors(11)   // (0, 0)
\`\`\`

さらに、**ラベル付き \`break\`** を使って、見つかった時点で二重ループを丸ごと抜けること（\`return\` を使わずに書いてみよう）。

## ポイント

\`\`\`rust
'outer: for a in 1..=9 {
    for b in 1..=9 {
        if 条件 {
            break 'outer;   // 外側のループまで一気に抜ける
        }
    }
}
\`\`\`

- ラベルは \`'\` で始まる名前（\`'outer\` など）
- 普通の \`break\` だと内側のループしか抜けないので、\`a\` が次に進んでしまう
- 結果は \`let mut found = (0, 0);\` に入れておき、最後に返す`,
    hints: [
      "`let mut found = (0, 0);` を用意する",
      "`if a * b == target { found = (a, b); break 'outer; }`",
    ],
  },
  initialCode: `fn find_factors(target: u32) -> (u32, u32) {
    todo!()
}
`,
  solutionCode: `fn find_factors(target: u32) -> (u32, u32) {
    let mut found = (0, 0);
    'outer: for a in 1..=9 {
        for b in 1..=9 {
            if a * b == target {
                found = (a, b);
                break 'outer;
            }
        }
    }
    found
}
`,
});
