import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-collect-results",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Vec<Result> を Result<Vec> に collect する",
    prompt: `## やること

文字列のリストを数に変換する関数を、**\`collect\` の型指定** を使って書こう。

- （1）\`parse_all(v: &[&str]) -> Result<Vec<i32>, String>\`
- 全部 i32 として読めれば \`Ok(Vec)\`
- 1 つでも読めなければ、**最初に失敗した項目** で \`Err("bad: {項目}")\`
- （2）\`sum_all(v: &[&str]) -> Result<i32, String>\` … parse_all の結果を \`?\` で受けて合計する
- （3）\`all_present(v: &[Option<i32>]) -> Option<Vec<i32>>\` … 全部 Some なら中身の Vec、1 つでも None なら None
- （4）\`split_valid(v: &[&str]) -> (Vec<i32>, usize)\` … 読めたものの Vec と、読めなかった個数（\`filter_map\` と \`count\`）

\`\`\`rust
parse_all(&["1", "2", "3"])     // Ok([1, 2, 3])
parse_all(&["1", "x", "y"])     // Err("bad: x")
all_present(&[Some(1), None])   // None
split_valid(&["1", "x", "3"])   // ([1, 3], 1)
\`\`\`

Result のイテレータを \`collect::<Result<Vec<_>, _>>()\` すると「全部 Ok なら Ok(Vec)、1 つでも Err なら最初の Err」になる。`,
    hints: [
      '`v.iter().map(|s| s.parse::<i32>().map_err(|_| format!("bad: {}", s))).collect()`',
      "sum_all は `Ok(parse_all(v)?.iter().sum())`",
      "all_present は `v.iter().copied().collect()`（戻り値の型から Option<Vec<i32>> に collect される）",
    ],
  },
  initialCode: `fn parse_all(v: &[&str]) -> Result<Vec<i32>, String> {
    todo!()
}

fn sum_all(v: &[&str]) -> Result<i32, String> {
    todo!()
}

fn all_present(v: &[Option<i32>]) -> Option<Vec<i32>> {
    todo!()
}

fn split_valid(v: &[&str]) -> (Vec<i32>, usize) {
    todo!()
}
`,
  solutionCode: `fn parse_all(v: &[&str]) -> Result<Vec<i32>, String> {
    v.iter()
        .map(|s| s.parse::<i32>().map_err(|_| format!("bad: {}", s)))
        .collect()
}

fn sum_all(v: &[&str]) -> Result<i32, String> {
    Ok(parse_all(v)?.iter().sum())
}

fn all_present(v: &[Option<i32>]) -> Option<Vec<i32>> {
    v.iter().copied().collect()
}

fn split_valid(v: &[&str]) -> (Vec<i32>, usize) {
    let ok: Vec<i32> = v.iter().filter_map(|s| s.parse().ok()).collect();
    let bad = v.iter().filter(|s| s.parse::<i32>().is_err()).count();
    (ok, bad)
}
`,
});
