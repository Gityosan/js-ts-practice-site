import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-stdlib-mem-swap-take",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "mem::swap / replace / take で中身を入れ替える",
    prompt: `## やること

\`\`\`rust
struct Buffer {
    name: String,
    items: Vec<String>,
}
\`\`\`

\`Buffer\` に 3 つのメソッドを実装しよう。どれも \`&mut self\` しか持っていないので、フィールドをそのまま返すと **E0507（借用の中から move できない）** になる。\`std::mem\` の関数を使おう。

| メソッド | 動き | 使う関数 |
|---|---|---|
| \`flush(&mut self) -> Vec<String>\` | \`items\` の中身をすべて返し、\`items\` は空にする | \`mem::take\` |
| \`rename(&mut self, new_name: &str) -> String\` | 名前を新しくし、**古い名前** を返す | \`mem::replace\` |
| \`swap_with(&mut self, other: &mut Buffer)\` | 2 つのバッファの \`items\` だけを入れ替える（名前はそのまま） | \`mem::swap\` |

さらに、普通の関数 \`rotate3(a: &mut i32, b: &mut i32, c: &mut i32)\` を書こう。\`(a, b, c)\` の値を \`(b, c, a)\` に回転させる（\`mem::swap\` を 2 回）。`,
    hints: [
      "`std::mem::take(&mut self.items)`",
      "`std::mem::replace(&mut self.name, new_name.to_string())`",
      "`mem::swap(&mut self.items, &mut other.items);`、回転は `mem::swap(a, b); mem::swap(b, c);`",
    ],
  },
  initialCode: `use std::mem;

struct Buffer {
    name: String,
    items: Vec<String>,
}

impl Buffer {
    fn flush(&mut self) -> Vec<String> {
        todo!()
    }

    fn rename(&mut self, new_name: &str) -> String {
        todo!()
    }

    fn swap_with(&mut self, other: &mut Buffer) {
        todo!()
    }
}

fn rotate3(a: &mut i32, b: &mut i32, c: &mut i32) {
    todo!()
}
`,
  solutionCode: `use std::mem;

struct Buffer {
    name: String,
    items: Vec<String>,
}

impl Buffer {
    fn flush(&mut self) -> Vec<String> {
        mem::take(&mut self.items)
    }

    fn rename(&mut self, new_name: &str) -> String {
        mem::replace(&mut self.name, new_name.to_string())
    }

    fn swap_with(&mut self, other: &mut Buffer) {
        mem::swap(&mut self.items, &mut other.items);
    }
}

fn rotate3(a: &mut i32, b: &mut i32, c: &mut i32) {
    mem::swap(a, b);
    mem::swap(b, c);
}
`,
});
