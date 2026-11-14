import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-decode-borrow",
  stage: "decode",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "& と &mut と *：借用の記号を読む",
    prompt: `## 所有権を渡さずに「貸す」

\`\`\`rust
fn add_one(v: &mut Vec<i32>) {
    v.push(1);
}

let len = calc_len(&text);
\`\`\`

- \`&x\` … \`x\` を **借りる**（不変の借用）。中身は読めるが変更できない
- \`&mut x\` … **変更できる借用**。同時に 1 つしか作れない
- 型の中の \`&mut Vec<i32>\` は「i32 の Vec への可変参照」という引数の型
- \`*r\` … 参照の先の値そのもの（参照外し）
- \`Vec<i32>\` の \`< >\` は **ジェネリクス**（中に入る型）。比較の \`<\` \`>\` とは別物`,
    hints: [
      "`&` は貸すだけ。持ち主（所有権）は変わらない。",
      "`&mut` は書き換えOKの貸し出し。",
      "`< >` が型の後ろにあったらジェネリクス。",
    ],
  },
  decode: {
    code: `fn add_one(v: &mut Vec<i32>) {
    v.push(1);
}

let mut nums = vec![1, 2];
add_one(&mut nums);
let first = &nums[0];
let copy = *first;`,
    quiz: [
      {
        prompt: "`&mut nums` は何をしている？",
        snippet: `add_one(&mut nums);`,
        choices: [
          "nums を変更できる形で貸している",
          "nums の所有権を渡している",
          "nums をコピーしている",
        ],
        answer: "nums を変更できる形で貸している",
        explain: "`&mut` は可変の借用。関数の中で push できるが、所有権は nums のまま。",
      },
      {
        prompt: "`Vec<i32>` の `< >` は何？",
        choices: ["中に入る要素の型（ジェネリクス）", "大小比較の記号", "範囲指定"],
        answer: "中に入る要素の型（ジェネリクス）",
        explain: "`Vec<i32>` は i32 を入れる Vec。型の後ろの `< >` はジェネリクス。",
      },
      {
        prompt: "`*first` の `*` は何？",
        snippet: `let copy = *first;`,
        choices: ["参照の先の値を取り出す（参照外し）", "掛け算", "ポインタの宣言"],
        answer: "参照の先の値を取り出す（参照外し）",
        explain: "`first` は `&i32`（参照）。`*first` でその先の i32 の値そのものを取り出す。",
      },
      {
        prompt: "`vec![1, 2]` の `[ ]` は何？",
        snippet: `let mut nums = vec![1, 2];`,
        choices: ["マクロ vec! に渡す要素の並び", "添字", "配列の型"],
        answer: "マクロ vec! に渡す要素の並び",
        explain: "`vec![...]` は Vec を作るマクロ。`[ ]` の中が最初の要素。",
      },
      {
        prompt: "`nums[0]` の `[ ]` は何？",
        snippet: `let first = &nums[0];`,
        choices: ["添字（0 番目を取り出す）", "配列リテラル", "マクロの引数"],
        answer: "添字（0 番目を取り出す）",
        explain: "名前の直後の `[ ]` は添字。範囲外だと panic する。",
      },
    ],
  },
});
