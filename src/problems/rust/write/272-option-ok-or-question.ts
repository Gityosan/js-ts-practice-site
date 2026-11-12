import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-option-ok-or-question",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ok_or と ? で Option を Result にする",
    prompt: `## やること

ユーザー一覧 \`&[(u32, &str)]\`（ID と名前）を扱う関数を書こう。

- （1）\`find_user(users, id) -> Result<&str, String>\`
- 見つかれば \`Ok(名前)\`、見つからなければ \`Err("user {id} not found")\`
- \`iter().find(...)\` は Option を返すので、\`ok_or_else\` で Result に変換する
- （2）\`greet(users, id_text: &str) -> Result<String, String>\`
- \`id_text\` を u32 に parse（失敗したら \`Err("invalid id: {id_text}")\`）
- find_user で探し（失敗したらそのエラーをそのまま返す）
- \`Ok("Hello, {名前}!")\`
- **\`?\` 演算子** を使って書こう
- （3）\`first_number(s: &str) -> Option<i32>\`
- カンマ区切りの **最初の項目** を trim して i32 に。Option を返す関数の中でも \`?\` が使える

\`\`\`rust
let users = [(1, "amy"), (2, "bob")];
greet(&users, "2")    // Ok("Hello, bob!")
greet(&users, "x")    // Err("invalid id: x")
greet(&users, "9")    // Err("user 9 not found")
\`\`\``,
    hints: [
      '`users.iter().find(|(i, _)| *i == id).map(|(_, n)| *n).ok_or_else(|| format!("user {} not found", id))`',
      '`let id: u32 = id_text.parse().map_err(|_| format!("invalid id: {}", id_text))?;`',
      "first_number は `s.split(',').next()?.trim().parse().ok()`",
    ],
  },
  initialCode: `fn find_user<'a>(users: &[(u32, &'a str)], id: u32) -> Result<&'a str, String> {
    todo!()
}

fn greet(users: &[(u32, &str)], id_text: &str) -> Result<String, String> {
    todo!()
}

fn first_number(s: &str) -> Option<i32> {
    todo!()
}
`,
  solutionCode: `fn find_user<'a>(users: &[(u32, &'a str)], id: u32) -> Result<&'a str, String> {
    users
        .iter()
        .find(|(i, _)| *i == id)
        .map(|(_, n)| *n)
        .ok_or_else(|| format!("user {} not found", id))
}

fn greet(users: &[(u32, &str)], id_text: &str) -> Result<String, String> {
    let id: u32 = id_text
        .parse()
        .map_err(|_| format!("invalid id: {}", id_text))?;
    let name = find_user(users, id)?;
    Ok(format!("Hello, {}!", name))
}

fn first_number(s: &str) -> Option<i32> {
    s.split(',').next()?.trim().parse().ok()
}
`,
});
