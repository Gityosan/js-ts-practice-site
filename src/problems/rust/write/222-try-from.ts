import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-try-from",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "TryFrom で範囲チェック付きの変換",
    prompt: `## やること

### 1. 自作型に TryFrom を実装

0〜100 の値だけを持てる \`Percent(u8)\` に、\`i32\` からの \`TryFrom\` を実装しよう。

- 0〜100 なら \`Ok(Percent(値))\`
- それ以外なら \`Err(format!("out of range: {}", v))\`（エラー型は \`String\`）

\`\`\`rust
Percent::try_from(50)                       // Ok(Percent(50))
Percent::try_from(150)                      // Err("out of range: 150")
let p: Result<Percent, _> = 7.try_into();   // TryFrom を実装すると try_into も使える
\`\`\`

### 2. 標準の TryFrom を使う

\`to_u8(x: i64) -> Option<u8>\` … u8 に収まれば \`Some\`、収まらなければ \`None\`。\`u8::try_from(x)\` の結果を \`.ok()\` で Option にしよう。

\`x as u8\` だと 300 が黙って 44 になってしまうが、\`try_from\` なら失敗を検出できる。`,
    hints: [
      "`type Error = String;` を impl の中に書く",
      "`if (0..=100).contains(&v) { Ok(Percent(v as u8)) } else { Err(format!(...)) }`",
      "to_u8 は `u8::try_from(x).ok()`",
    ],
  },
  initialCode: `#[derive(Debug)]
struct Percent(u8);

impl TryFrom<i32> for Percent {
    type Error = String;

    fn try_from(v: i32) -> Result<Self, Self::Error> {
        todo!()
    }
}

fn to_u8(x: i64) -> Option<u8> {
    todo!()
}
`,
  solutionCode: `#[derive(Debug)]
struct Percent(u8);

impl TryFrom<i32> for Percent {
    type Error = String;

    fn try_from(v: i32) -> Result<Self, Self::Error> {
        if (0..=100).contains(&v) {
            Ok(Percent(v as u8))
        } else {
            Err(format!("out of range: {}", v))
        }
    }
}

fn to_u8(x: i64) -> Option<u8> {
    u8::try_from(x).ok()
}
`,
});
