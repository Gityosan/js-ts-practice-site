import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-mod-inline-pub",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "インラインモジュールと pub",
    prompt: `## やること

\`mod\` でモジュールを作り、外（クレートルート）から使えるように \`pub\` を付けよう。

次の構造を作る。

\`\`\`text
crate
 └── math
     ├── add(a, b)            … 公開
     ├── square(x)            … 公開
     ├── checked(x)           … 非公開（math の中だけで使う補助関数）
     └── stats                … 公開モジュール
         ├── mean(xs)         … 公開。空なら None
         └── max(xs)          … 公開。空なら None
\`\`\`

- \`math::add(a: i32, b: i32) -> i32\`
- \`math::square(x: i32) -> i32\`
- \`math::stats::mean(xs: &[i32]) -> Option<f64>\` … 平均
- \`math::stats::max(xs: &[i32]) -> Option<i32>\` … 最大値

採点側はクレートルートから \`math::stats::mean(&[1, 2, 3])\` のように呼ぶ。初期コードは \`pub\` が足りないので、このままでは **コンパイルエラー（E0603: 非公開）** になる。`,
    hints: [
      "外から呼ぶ関数には `pub fn`、外からたどるモジュールには `pub mod` が必要。",
      "`stats` の中から親の関数を使うなら `super::add(...)` と書ける（今回は使わなくてもよい）。",
      "`mean` は `if xs.is_empty() { None } else { Some(xs.iter().sum::<i32>() as f64 / xs.len() as f64) }`、`max` は `xs.iter().copied().max()`。",
    ],
  },
  initialCode: `mod math {
    fn add(a: i32, b: i32) -> i32 {
        todo!()
    }

    fn square(x: i32) -> i32 {
        todo!()
    }

    mod stats {
        fn mean(xs: &[i32]) -> Option<f64> {
            todo!()
        }

        fn max(xs: &[i32]) -> Option<i32> {
            todo!()
        }
    }
}
`,
  solutionCode: `mod math {
    pub fn add(a: i32, b: i32) -> i32 {
        a + b
    }

    pub fn square(x: i32) -> i32 {
        x * x
    }

    pub mod stats {
        pub fn mean(xs: &[i32]) -> Option<f64> {
            if xs.is_empty() {
                None
            } else {
                Some(xs.iter().sum::<i32>() as f64 / xs.len() as f64)
            }
        }

        pub fn max(xs: &[i32]) -> Option<i32> {
            xs.iter().copied().max()
        }
    }
}
`,
});
