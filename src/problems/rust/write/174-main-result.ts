import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-main-returns-result",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "main から Result を返す",
    prompt: `## やること

\`fn main\` を **自分で書く** 問題。main の戻り値を \`Result\` にすると、main の中でも \`?\` が使える。

次のプログラムを完成させよう。

- \`parse_line(line: &str) -> Result<(String, u32), ParseIntError>\` … \`"apple 120"\` を \`("apple", 120)\` にする（空白で 2 つに分け、2 つ目を parse。分けられなければ全体を名前、価格は空文字列として parse → Err でよい）
- \`main() -> Result<(), ParseIntError>\` … 下の 3 行を \`parse_line(..)?\` で読み、各行を \`apple: 120円\` の形で表示し、最後に \`合計: 450円\` を表示して \`Ok(())\` を返す

\`\`\`rust
let lines = ["apple 120", "milk 210", "bread 120"];
\`\`\`

期待する出力:

\`\`\`text
apple: 120円
milk: 210円
bread: 120円
合計: 450円
\`\`\`

\`split_once(' ')\` は \`Option<(&str, &str)>\` を返す。\`unwrap_or((line, ""))\` で分けられなかった場合を補える。`,
    hints: [
      "`let (name, price) = line.split_once(' ').unwrap_or((line, \"\"));`",
      "`Ok((name.to_string(), price.trim().parse()?))`",
      "main の最後は `Ok(())`",
    ],
  },
  initialCode: `use std::num::ParseIntError;

fn parse_line(line: &str) -> Result<(String, u32), ParseIntError> {
    todo!()
}

fn main() -> Result<(), ParseIntError> {
    let lines = ["apple 120", "milk 210", "bread 120"];
    // ここで各行を parse_line(..)? で読み、表示して合計を出そう
    Ok(())
}
`,
  solutionCode: `use std::num::ParseIntError;

fn parse_line(line: &str) -> Result<(String, u32), ParseIntError> {
    let (name, price) = line.split_once(' ').unwrap_or((line, ""));
    Ok((name.to_string(), price.trim().parse()?))
}

fn main() -> Result<(), ParseIntError> {
    let lines = ["apple 120", "milk 210", "bread 120"];
    let mut total = 0;
    for line in lines {
        let (name, price) = parse_line(line)?;
        println!("{name}: {price}円");
        total += price;
    }
    println!("合計: {total}円");
    Ok(())
}
`,
});
