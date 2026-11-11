import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-e0502-e0499-borrow",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "E0502 / E0499 を直す: 借用がぶつかっている",
    prompt: `## やること

初期コードの 2 つの関数は、どちらも **借用の衝突** でコンパイルエラーになる。動作を変えずに直そう。

### \`append_first(v: &mut Vec<i32>) -> Option<i32>\` — E0502

先頭の要素を末尾に追加し、追加した値を \`Some\` で返す関数（空の Vec なら何もせず \`None\`）。\`let first = &v[0];\` で不変借用したまま \`v.push(...)\` し、その後でまた \`first\` を使っているのが原因（push で Vec が再確保されると \`first\` が古いメモリを指してしまう）。\`i32\` は \`Copy\` なので **値をコピーして** 取り出せばよい。

### \`bump_both(v: &mut Vec<i32>)\` — E0499

先頭と末尾の要素にそれぞれ 1 を足す関数。\`&mut v[0]\` と \`&mut v[last]\` を同時に持とうとしているのが原因。**1 つずつ順番に** 変更すればよい（要素が 1 つなら、その要素に 2 足される）。空なら何もしない。


※ この問題の初期コードは **わざとコンパイルが通らない** ようになっている。エラーメッセージを読んで直そう。`,
    hints: [
      "`let first = v[0];`（`&` を外すと値のコピーになる）",
      "コピーした値なら push の後も自由に使える: `v.push(first); Some(first)`",
      "bump_both: `v[0] += 1; let last = v.len() - 1; v[last] += 1;`",
    ],
  },
  initialCode: `fn append_first(v: &mut Vec<i32>) -> Option<i32> {
    if v.is_empty() {
        return None;
    }
    let first = &v[0];
    v.push(*first);
    Some(*first)
}

fn bump_both(v: &mut Vec<i32>) {
    if v.is_empty() {
        return;
    }
    let last = v.len() - 1;
    let a = &mut v[0];
    let b = &mut v[last];
    *a += 1;
    *b += 1;
}
`,
  solutionCode: `fn append_first(v: &mut Vec<i32>) -> Option<i32> {
    if v.is_empty() {
        return None;
    }
    let first = v[0];
    v.push(first);
    Some(first)
}

fn bump_both(v: &mut Vec<i32>) {
    if v.is_empty() {
        return;
    }
    let last = v.len() - 1;
    v[0] += 1;
    v[last] += 1;
}
`,
});
