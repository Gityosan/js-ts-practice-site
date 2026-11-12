import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-option-question-mark",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Option でも ? を使う",
    prompt: `## やること

戻り値が \`Option\` の関数では、Option に \`?\` を付けると「None ならその場で None を返す」になる。

- \`first_char_of_last_word(s: &str) -> Option<char>\` … 最後の単語の最初の文字。単語がなければ None（\`split_whitespace().last()?\` → \`.chars().next()\`）
- \`add_first_two(v: &[&str]) -> Option<i32>\` … 先頭 2 つを数値にして足す。要素が足りない・数値でないなら None。Result を Option にするには \`.ok()\` を使う（\`v.get(0)?.parse::<i32>().ok()?\`）
- \`initials(full: &str) -> Option<String>\` … \`"Taro Yamada"\` → \`Some("T.Y.")\`。単語がちょうど 2 つでなければ None

\`\`\`rust
first_char_of_last_word("hello rust world");  // Some('w')
add_first_two(&["3", "4", "x"]);               // Some(7)
add_first_two(&["3"]);                         // None
initials("Taro Yamada");                       // Some("T.Y.")
\`\`\``,
    hints: [
      "`s.split_whitespace().last()?.chars().next()`",
      "`let a = v.get(0)?.parse::<i32>().ok()?;`",
      "initials: `let mut it = full.split_whitespace(); let a = it.next()?; let b = it.next()?; if it.next().is_some() { return None; }`",
    ],
  },
  initialCode: `fn first_char_of_last_word(s: &str) -> Option<char> {
    todo!()
}

fn add_first_two(v: &[&str]) -> Option<i32> {
    todo!()
}

fn initials(full: &str) -> Option<String> {
    todo!()
}
`,
  solutionCode: `fn first_char_of_last_word(s: &str) -> Option<char> {
    s.split_whitespace().last()?.chars().next()
}

fn add_first_two(v: &[&str]) -> Option<i32> {
    let a = v.get(0)?.parse::<i32>().ok()?;
    let b = v.get(1)?.parse::<i32>().ok()?;
    Some(a + b)
}

fn initials(full: &str) -> Option<String> {
    let mut it = full.split_whitespace();
    let first = it.next()?.chars().next()?;
    let last = it.next()?.chars().next()?;
    if it.next().is_some() {
        return None;
    }
    Some(format!("{first}.{last}."))
}
`,
});
