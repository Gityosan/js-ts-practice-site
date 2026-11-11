import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-let-else-parse",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "if let と let else でパースする",
    prompt: `## やること

\`"名前:年齢"\` 形式の文字列を扱う。

- \`parse_person(s: &str) -> Option<(String, u32)>\` … \`"alice:30"\` → \`Some(("alice".to_string(), 30))\`。\`:\` がない・年齢が数値でない・名前が空 のどれかなら \`None\`。**let else で書いてみよう**
- \`greet(s: &str) -> String\` … \`parse_person\` を使い、成功なら \`"こんにちは、alice さん（30 歳）"\`、失敗なら \`"不正な入力"\`。**if let ... else で書く**

\`\`\`rust
parse_person("bob:7");     // Some(("bob", 7))
parse_person("bob");       // None（: がない）
parse_person("bob:abc");   // None（数値でない）
\`\`\`

使える道具:

- \`s.split_once(':')\` … 最初の \`:\` で 2 つに分けて \`Option<(&str, &str)>\` を返す
- \`t.parse::<u32>()\` … \`Result<u32, _>\` を返す。let else では \`let Ok(age) = ... else { return None };\`
- \`name.is_empty()\` … 空文字列かどうか`,
    hints: [
      "`let Some((name, age)) = s.split_once(':') else { return None; };`",
      "`let Ok(age) = age.parse::<u32>() else { return None; };`",
      "`if name.is_empty() { return None; }` を忘れずに",
      "greet: `if let Some((name, age)) = parse_person(s) { format!(...) } else { ... }`",
    ],
  },
  initialCode: `fn parse_person(s: &str) -> Option<(String, u32)> {
    todo!()
}

fn greet(s: &str) -> String {
    todo!()
}
`,
  solutionCode: `fn parse_person(s: &str) -> Option<(String, u32)> {
    let Some((name, age)) = s.split_once(':') else {
        return None;
    };
    let Ok(age) = age.parse::<u32>() else {
        return None;
    };
    if name.is_empty() {
        return None;
    }
    Some((name.to_string(), age))
}

fn greet(s: &str) -> String {
    if let Some((name, age)) = parse_person(s) {
        format!("こんにちは、{name} さん（{age} 歳）")
    } else {
        String::from("不正な入力")
    }
}
`,
});
