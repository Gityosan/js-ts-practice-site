import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-closure-capture",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "環境をキャプチャするクロージャ",
    prompt: `## やること

周りの変数をキャプチャするクロージャを、関数の中で作って使おう。

- （1）\`count_above(v: &[i32], threshold: i32) -> usize\`
- \`let is_big = |x: i32| ...;\` のように threshold を **キャプチャ** するクロージャを作り、それで数える
- （2）\`running_total(v: &[i32]) -> Vec<i32>\`
- 累積和を返す。\`let mut total = 0;\` を **可変借用** して書き換えるクロージャ \`let mut add = |x: i32| { total += x; total };\` を作り、各要素に適用して結果を集める
- （3）\`tag_all(words: &[&str], tag: String) -> Vec<String>\`
- 各単語の後ろに \`":" + tag\` を付ける。\`move\` で tag を所有するクロージャを作って使う

\`\`\`rust
count_above(&[1, 5, 10, 3], 4)          // 2
running_total(&[1, 2, 3, 4])            // [1, 3, 6, 10]
tag_all(&["a", "b"], "x".to_string())   // ["a:x", "b:x"]
\`\`\``,
    hints: [
      "`let is_big = |x: i32| x > threshold;` → for で `if is_big(x) { n += 1; }`",
      "running_total は `let mut out = Vec::new(); for &x in v { out.push(add(x)); } out`",
      '`let label = move |w: &str| format!("{}:{}", w, tag);`',
    ],
  },
  initialCode: `fn count_above(v: &[i32], threshold: i32) -> usize {
    todo!()
}

fn running_total(v: &[i32]) -> Vec<i32> {
    todo!()
}

fn tag_all(words: &[&str], tag: String) -> Vec<String> {
    todo!()
}
`,
  solutionCode: `fn count_above(v: &[i32], threshold: i32) -> usize {
    let is_big = |x: i32| x > threshold;
    let mut n = 0;
    for &x in v {
        if is_big(x) {
            n += 1;
        }
    }
    n
}

fn running_total(v: &[i32]) -> Vec<i32> {
    let mut total = 0;
    let mut add = |x: i32| {
        total += x;
        total
    };
    let mut out = Vec::new();
    for &x in v {
        out.push(add(x));
    }
    out
}

fn tag_all(words: &[&str], tag: String) -> Vec<String> {
    let label = move |w: &str| format!("{}:{}", w, tag);
    let mut out = Vec::new();
    for w in words {
        out.push(label(w));
    }
    out
}
`,
});
