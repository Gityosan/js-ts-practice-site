import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ex-bracket-matching",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "総合: 括弧の対応チェック",
    prompt: `## やること

文字列の中の括弧 \`()\` \`[]\` \`{}\` が正しく対応しているかを調べる \`check_brackets(s: &str) -> Result<(), usize>\` を書こう。

- 正しく対応していれば \`Ok(())\`
- 間違いがあれば、その **文字位置**（0 始まり、\`chars()\` で数えた位置）を \`Err\` で返す
  - 対応しない閉じ括弧（種類が違う・開き括弧がない）が見つかったら、**その閉じ括弧の位置**
  - 最後まで読んで閉じられていない開き括弧が残っていたら、**残っているうち最も前の開き括弧の位置**
- 括弧以外の文字は無視する

\`\`\`rust
check_brackets("fn main() { let v = [1, 2]; }") // Ok(())
check_brackets("(]")      // Err(1)
check_brackets("{ [ ( ) ]") // Err(0)
\`\`\`

## 設計のヒント

開き括弧を見たら \`(文字, 位置)\` をスタックに積み、閉じ括弧を見たらスタックの一番上と対応しているか調べる。`,
    hints: [
      "`let mut stack: Vec<(char, usize)> = Vec::new(); for (i, c) in s.chars().enumerate() { ... }`",
      "閉じ括弧に対応する開き括弧を `match c { ')' => '(', ']' => '[', '}' => '{', _ => ... }` で求める",
      "`match stack.pop() { Some((open, _)) if open == expected => {}, _ => return Err(i) }`、最後は `match stack.first() { Some(&(_, i)) => Err(i), None => Ok(()) }`",
    ],
  },
  initialCode: `fn check_brackets(s: &str) -> Result<(), usize> {
    todo!()
}
`,
  solutionCode: `fn check_brackets(s: &str) -> Result<(), usize> {
    let mut stack: Vec<(char, usize)> = Vec::new();
    for (i, c) in s.chars().enumerate() {
        match c {
            '(' | '[' | '{' => stack.push((c, i)),
            ')' | ']' | '}' => {
                let expected = match c {
                    ')' => '(',
                    ']' => '[',
                    _ => '{',
                };
                match stack.pop() {
                    Some((open, _)) if open == expected => {}
                    _ => return Err(i),
                }
            }
            _ => {}
        }
    }
    match stack.first() {
        Some(&(_, i)) => Err(i),
        None => Ok(()),
    }
}
`,
});
