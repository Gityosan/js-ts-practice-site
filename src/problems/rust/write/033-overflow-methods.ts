import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-overflow-methods",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "オーバーフローを安全に扱う（wrapping / checked / saturating）",
    prompt: `## やること

\`u8\`（0〜255）の計算で、あふれたときの振る舞いが違う 3 つの関数を書こう。

| 関数 | あふれたとき | 例 |
|---|---|---|
| \`add_wrap(a, b)\` | 折り返す | \`add_wrap(250, 10)\` → \`4\` |
| \`add_checked(a, b)\` | \`None\` を返す（あふれなければ \`Some(和)\`） | \`add_checked(250, 10)\` → \`None\` |
| \`sub_saturate(a, b)\` | 0 に張り付く | \`sub_saturate(3, 10)\` → \`0\` |

## ポイント

- 普通に \`a + b\` と書くと、debug ビルドではあふれた瞬間に **panic** する
- 整数型には \`wrapping_add\`, \`checked_add\`, \`saturating_sub\` などのメソッドがある
- \`Option<u8>\` は「\`Some(u8 の値)\` か \`None\`」のどちらかを表す型`,
    hints: [
      "`a.wrapping_add(b)`",
      "`a.checked_add(b)` はそのまま `Option<u8>` を返す",
      "`a.saturating_sub(b)`",
    ],
  },
  initialCode: `fn add_wrap(a: u8, b: u8) -> u8 {
    todo!()
}

fn add_checked(a: u8, b: u8) -> Option<u8> {
    todo!()
}

fn sub_saturate(a: u8, b: u8) -> u8 {
    todo!()
}
`,
  solutionCode: `fn add_wrap(a: u8, b: u8) -> u8 {
    a.wrapping_add(b)
}

fn add_checked(a: u8, b: u8) -> Option<u8> {
    a.checked_add(b)
}

fn sub_saturate(a: u8, b: u8) -> u8 {
    a.saturating_sub(b)
}
`,
});
