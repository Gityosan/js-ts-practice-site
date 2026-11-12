import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-vec-stats",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "平均・中央値・最頻値",
    prompt: `## やること

整数の Vec の統計量を求める関数を 3 つ書こう。どれも **空なら None**。

- \`mean(v: &[i32]) -> Option<f64>\` … 平均
- \`median(v: &[i32]) -> Option<f64>\` … 中央値。並べ替えた真ん中の値。個数が偶数なら真ん中 2 つの平均
- \`mode(v: &[i32]) -> Option<i32>\` … 最頻値（一番多く現れる値）。同数なら **小さい方**

\`\`\`rust
mean(&[1, 2, 3, 4]);          // Some(2.5)
median(&[5, 1, 3]);           // Some(3.0)
median(&[4, 1, 3, 2]);        // Some(2.5)
mode(&[3, 1, 3, 1, 2]);       // Some(1)（1 と 3 が 2 回ずつ → 小さい方）
\`\`\`

- 引数は \`&[i32]\` で借りているだけなので並べ替えられない。\`let mut s = v.to_vec(); s.sort();\` でコピーしてから並べよう
- \`i32\` を \`f64\` にするのは \`x as f64\`
- 最頻値は、ソート済みの Vec を前から見て「同じ値が何個続くか」を数えると HashMap なしで求められる`,
    hints: [
      "mean: `v.iter().sum::<i32>() as f64 / v.len() as f64`",
      "median: `let n = s.len(); if n % 2 == 1 { s[n / 2] as f64 } else { (s[n/2 - 1] + s[n/2]) as f64 / 2.0 }`",
      "mode: ソートして連続する個数を数え、`count > best_count` のときだけ更新すると同数なら先に出た小さい値が残る",
    ],
  },
  initialCode: `fn mean(v: &[i32]) -> Option<f64> {
    todo!()
}

fn median(v: &[i32]) -> Option<f64> {
    todo!()
}

fn mode(v: &[i32]) -> Option<i32> {
    todo!()
}
`,
  solutionCode: `fn mean(v: &[i32]) -> Option<f64> {
    if v.is_empty() {
        return None;
    }
    let sum: i32 = v.iter().sum();
    Some(sum as f64 / v.len() as f64)
}

fn median(v: &[i32]) -> Option<f64> {
    if v.is_empty() {
        return None;
    }
    let mut s = v.to_vec();
    s.sort();
    let n = s.len();
    if n % 2 == 1 {
        Some(s[n / 2] as f64)
    } else {
        Some((s[n / 2 - 1] + s[n / 2]) as f64 / 2.0)
    }
}

fn mode(v: &[i32]) -> Option<i32> {
    let mut s = v.to_vec();
    s.sort();
    let mut best: Option<(i32, usize)> = None;
    let mut i = 0;
    while i < s.len() {
        let mut j = i;
        while j < s.len() && s[j] == s[i] {
            j += 1;
        }
        let count = j - i;
        match best {
            Some((_, c)) if c >= count => {}
            _ => best = Some((s[i], count)),
        }
        i = j;
    }
    best.map(|(value, _)| value)
}
`,
});
