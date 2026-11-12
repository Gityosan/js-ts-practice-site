import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-vec-iter-modes",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "&v / &mut v / v の 3 種類のループ",
    prompt: `## やること

3 種類の for ループを使い分ける。

- \`total_len(words: &Vec<String>) -> usize\` … 全単語の文字数（\`len()\`）の合計。**\`for w in words\`（不変借用）** で回す。呼び出し後も words は使える
- \`clamp_all(v: &mut Vec<i32>, lo: i32, hi: i32)\` … 各要素を \`lo\` 以上 \`hi\` 以下に収める。**\`for x in v.iter_mut()\` / \`for x in v\`（可変借用）** で \`*x = ...\`
- \`into_upper(words: Vec<String>) -> Vec<String>\` … 所有権を受け取り、各単語を大文字にした新しい Vec を返す。**\`for w in words\`（ムーブ）** で回す
- \`push_doubles(v: &mut Vec<i32>)\` … 今ある各要素の 2 倍を **末尾に追加** する（\`[1, 2]\` → \`[1, 2, 2, 4]\`）

最後の問題は「v を回しながら v に push」することになり、そのままでは **借用エラー** になる。
先に別の Vec に集めてから \`extend\` するか、添字で回そう（\`for i in 0..v.len()\` の \`v.len()\` はループ開始時に 1 回だけ評価される）。`,
    hints: [
      "total_len: `let mut n = 0; for w in words { n += w.len(); } n`",
      "clamp: `*x = (*x).clamp(lo, hi);` か if で比較",
      "into_upper: `w.to_uppercase()` を新しい Vec に push",
      "push_doubles: `let extra: Vec<i32> = v.iter().map(|x| x * 2).collect(); v.extend(extra);`",
    ],
  },
  initialCode: `fn total_len(words: &Vec<String>) -> usize {
    todo!()
}

fn clamp_all(v: &mut Vec<i32>, lo: i32, hi: i32) {
    todo!()
}

fn into_upper(words: Vec<String>) -> Vec<String> {
    todo!()
}

fn push_doubles(v: &mut Vec<i32>) {
    todo!()
}
`,
  solutionCode: `fn total_len(words: &Vec<String>) -> usize {
    let mut n = 0;
    for w in words {
        n += w.len();
    }
    n
}

fn clamp_all(v: &mut Vec<i32>, lo: i32, hi: i32) {
    for x in v.iter_mut() {
        if *x < lo {
            *x = lo;
        } else if *x > hi {
            *x = hi;
        }
    }
}

fn into_upper(words: Vec<String>) -> Vec<String> {
    let mut out = Vec::new();
    for w in words {
        out.push(w.to_uppercase());
    }
    out
}

fn push_doubles(v: &mut Vec<i32>) {
    for i in 0..v.len() {
        let d = v[i] * 2;
        v.push(d);
    }
}
`,
});
