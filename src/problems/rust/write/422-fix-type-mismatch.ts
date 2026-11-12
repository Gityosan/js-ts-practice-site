import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-e0308-mismatched",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "E0308 を直す: 型が合わない",
    prompt: `## やること

初期コードには **型の不一致（E0308: mismatched types）** が 3 か所ある（\`i32\` を \`usize\` で割ろうとしている E0277 も一緒に出る）。\`expected\` と \`found\` をよく読んで直そう。関数のシグネチャ（引数と戻り値の型）は **変えない** こと。

- \`average(v: &[i32]) -> f64\` … 平均を返す。\`i32\` の合計をそのまま \`f64\` として返そうとしている。\`as f64\` で変換する（空なら \`0.0\`）
- \`label(score: u32) -> String\` … 80 以上なら \`"合格"\`、それ未満なら \`"不合格"\`。\`&str\` を返そうとしている。\`String\` に変換する
- \`total_ms(sec: u32) -> u64\` … 秒をミリ秒にして返す。最後の行に \`;\` が付いていて \`()\` を返している。さらに \`u32\` を \`u64\` に変換する必要がある（\`u64::from(sec)\` または \`sec as u64\`）


※ この問題の初期コードは **わざとコンパイルが通らない** ようになっている。エラーメッセージを読んで直そう。`,
    hints: [
      "`sum as f64 / v.len() as f64`",
      '`String::from("合格")` または `"合格".to_string()`',
      "`u64::from(sec) * 1000`（末尾の `;` は消す）",
    ],
  },
  initialCode: `fn average(v: &[i32]) -> f64 {
    if v.is_empty() {
        return 0;
    }
    let sum: i32 = v.iter().sum();
    sum / v.len()
}

fn label(score: u32) -> String {
    if score >= 80 {
        "合格"
    } else {
        "不合格"
    }
}

fn total_ms(sec: u32) -> u64 {
    sec * 1000;
}
`,
  solutionCode: `fn average(v: &[i32]) -> f64 {
    if v.is_empty() {
        return 0.0;
    }
    let sum: i32 = v.iter().sum();
    sum as f64 / v.len() as f64
}

fn label(score: u32) -> String {
    if score >= 80 {
        String::from("合格")
    } else {
        String::from("不合格")
    }
}

fn total_ms(sec: u32) -> u64 {
    u64::from(sec) * 1000
}
`,
});
