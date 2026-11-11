import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-e0596-e0425-misc",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "E0596 / E0425 / E0384 を直す: mut と名前のミス",
    prompt: `## やること

初期コードには、初学者がよくやるミスが 4 つ入っている。エラーを 1 つずつ読んで直そう。

- **E0596**: \`mut\` でない変数を変更しようとしている（\`let\` に \`mut\` が必要）
- **E0596**: \`&Vec<i32>\` で受け取った引数を変更しようとしている（\`&mut Vec<i32>\` にし、呼び出し側も \`&mut\` で渡す）
- **E0384**: \`mut\` でない変数に再代入している
- **E0425**: 変数名のタイプミス（rustc が似た名前を提案してくれる）

最初からすべてのエラーが表示されるとは限らない。rustc は「名前の解決 → 型検査 → 借用検査」と段階的に調べるので、1 つ直すと次の段階のエラー（E0384 など）が新しく出てくることがある。

関数の目的:

- \`push_twice(v, x)\` … \`v\` の末尾に \`x\` を 2 回追加する
- \`build(n)\` … \`1..=n\` を 2 回ずつ並べた Vec を返す（例: \`build(2)\` → \`[1, 1, 2, 2]\`）
- \`sum_to(n)\` … \`1 + 2 + ... + n\` を返す


※ この問題の初期コードは **わざとコンパイルが通らない** ようになっている。エラーメッセージを読んで直そう。`,
    hints: [
      "`fn push_twice(v: &mut Vec<i32>, x: i32)`",
      "`let mut v = Vec::new();` と `push_twice(&mut v, i);`",
      "`let mut total = 0;` と、`totl` のタイプミスを `total` に",
    ],
  },
  initialCode: `fn push_twice(v: &Vec<i32>, x: i32) {
    v.push(x);
    v.push(x);
}

fn build(n: i32) -> Vec<i32> {
    let v = Vec::new();
    for i in 1..=n {
        push_twice(&v, i);
    }
    v
}

fn sum_to(n: i32) -> i32 {
    let total = 0;
    for i in 1..=n {
        total = total + i;
    }
    totl
}
`,
  solutionCode: `fn push_twice(v: &mut Vec<i32>, x: i32) {
    v.push(x);
    v.push(x);
}

fn build(n: i32) -> Vec<i32> {
    let mut v = Vec::new();
    for i in 1..=n {
        push_twice(&mut v, i);
    }
    v
}

fn sum_to(n: i32) -> i32 {
    let mut total = 0;
    for i in 1..=n {
        total = total + i;
    }
    total
}
`,
});
