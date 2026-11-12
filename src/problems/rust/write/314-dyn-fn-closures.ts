import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-dyn-fn-closures",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Box<dyn Fn> でクロージャを並べる",
    prompt: `## やること

クロージャは 1 つ 1 つが別の型なので、Vec にまとめるには \`Box<dyn Fn(i32) -> i32>\` にする。

- \`adder(n: i32) -> Box<dyn Fn(i32) -> i32>\` … \`x + n\` を返すクロージャ
- \`multiplier(n: i32) -> Box<dyn Fn(i32) -> i32>\` … \`x * n\` を返すクロージャ
- \`compose_all(fs: &[Box<dyn Fn(i32) -> i32>], x: i32) -> i32\` … 先頭から順に適用した結果
- \`build(spec: &str) -> Vec<Box<dyn Fn(i32) -> i32>>\` … \`"+3 *2 +1"\` のような空白区切りの文字列から関数の列を作る（\`+n\` は adder、\`*n\` は multiplier）。形式は正しいと仮定してよい

\`\`\`rust
adder(5)(10)                         // 15
compose_all(&[adder(1), multiplier(10)], 3) // 40
compose_all(&build("+3 *2 +1"), 1)   // ((1 + 3) * 2) + 1 = 9
\`\`\``,
    hints: [
      "`Box::new(move |x| x + n)` — `n` をクロージャに `move` で持たせる。",
      "`compose_all` は `fs.iter().fold(x, |acc, f| f(acc))`。",
      "`build` は `spec.split_whitespace()` で分け、`tok.split_at(1)` で記号と数字に分けて `parse::<i32>().unwrap()`。",
    ],
  },
  initialCode: `fn adder(n: i32) -> Box<dyn Fn(i32) -> i32> {
    todo!()
}

fn multiplier(n: i32) -> Box<dyn Fn(i32) -> i32> {
    todo!()
}

fn compose_all(fs: &[Box<dyn Fn(i32) -> i32>], x: i32) -> i32 {
    todo!()
}

fn build(spec: &str) -> Vec<Box<dyn Fn(i32) -> i32>> {
    todo!()
}
`,
  solutionCode: `fn adder(n: i32) -> Box<dyn Fn(i32) -> i32> {
    Box::new(move |x| x + n)
}

fn multiplier(n: i32) -> Box<dyn Fn(i32) -> i32> {
    Box::new(move |x| x * n)
}

fn compose_all(fs: &[Box<dyn Fn(i32) -> i32>], x: i32) -> i32 {
    fs.iter().fold(x, |acc, f| f(acc))
}

fn build(spec: &str) -> Vec<Box<dyn Fn(i32) -> i32>> {
    spec.split_whitespace()
        .map(|tok| {
            let (op, num) = tok.split_at(1);
            let n: i32 = num.parse().unwrap();
            if op == "+" { adder(n) } else { multiplier(n) }
        })
        .collect()
}
`,
});
