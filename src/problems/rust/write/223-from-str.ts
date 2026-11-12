import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-from-str",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: 'FromStr を実装して "3,4" を parse する',
    prompt: `## やること

\`Point\` に \`FromStr\` を実装して、\`"3,4"\` のような文字列を \`parse\` できるようにしよう。

- \`"x,y"\` の形。カンマの前後の空白は無視する（\`" -1 , 7 "\` もOK）
- カンマがなければ \`Err("no comma")\`
- x か y が整数として読めなければ \`Err("bad number")\`
- エラー型は \`String\`

\`\`\`rust
"3,4".parse::<Point>()       // Ok(Point { x: 3, y: 4 })
" -1 , 7 ".parse::<Point>()  // Ok(Point { x: -1, y: 7 })
"3".parse::<Point>()         // Err("no comma")
"a,4".parse::<Point>()       // Err("bad number")
\`\`\`

便利な道具:
- \`s.split_once(',')\` … 最初のカンマで 2 つに分けて \`Option<(&str, &str)>\` を返す
- \`.trim()\` … 前後の空白を除く
- \`.parse::<i32>()\` … 整数に変換（\`Result\`）`,
    hints: [
      "`let (a, b) = match s.split_once(',') { Some(p) => p, None => return Err(String::from(\"no comma\")) };`",
      '`let x = a.trim().parse::<i32>().map_err(|_| String::from("bad number"))?;`',
      "`ok_or` と `?` を使うと短く書ける: `s.split_once(',').ok_or(\"no comma\")?`（&str は ? で String に変換される）",
    ],
  },
  initialCode: `use std::str::FromStr;

#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

impl FromStr for Point {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        todo!()
    }
}
`,
  solutionCode: `use std::str::FromStr;

#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

impl FromStr for Point {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (a, b) = s.split_once(',').ok_or("no comma")?;
        let x = a.trim().parse::<i32>().map_err(|_| "bad number")?;
        let y = b.trim().parse::<i32>().map_err(|_| "bad number")?;
        Ok(Point { x, y })
    }
}
`,
});
