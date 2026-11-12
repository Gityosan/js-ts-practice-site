import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-trait-assoc-container",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "関連型を持つ Container トレイト",
    prompt: `## やること

関連型 \`Item\` を持つトレイト \`Container\` を、2 つの型に実装しよう。

\`\`\`rust
trait Container {
    type Item;
    fn get(&self, i: usize) -> Option<&Self::Item>;
    fn first(&self) -> Option<&Self::Item>;
    fn len(&self) -> usize;
}
\`\`\`

- \`Stack<T> { items: Vec<T> }\` … \`Item = T\`。\`get(i)\` は i 番目、\`first()\` は先頭（0 番目）
- \`Letters { text: String, chars: Vec<char> }\` … \`Item = char\`。文字の並び（\`Letters::new\` は用意済み）
- \`last_item<C: Container>(c: &C) -> Option<&C::Item>\` … 最後の要素（空なら \`None\`）。**どの Container でも動く** ように \`get\` と \`len\` だけで書く

\`\`\`rust
let s = Stack { items: vec![10, 20, 30] };
s.get(1)          // Some(20)
s.first()         // Some(10)
last_item(&s)     // Some(30)
last_item(&Letters::new("abc")) // Some('c')
\`\`\``,
    hints: [
      "`impl<T> Container for Stack<T> { type Item = T; fn get(&self, i: usize) -> Option<&T> { self.items.get(i) } ... }`",
      "`first` は `self.get(0)` と書ける。",
      "`last_item` は `if c.len() == 0 { None } else { c.get(c.len() - 1) }`。",
    ],
  },
  initialCode: `trait Container {
    type Item;
    fn get(&self, i: usize) -> Option<&Self::Item>;
    fn first(&self) -> Option<&Self::Item>;
    fn len(&self) -> usize;
}

struct Stack<T> {
    items: Vec<T>,
}

struct Letters {
    text: String,
    chars: Vec<char>,
}

impl Letters {
    fn new(text: &str) -> Letters {
        Letters { text: text.to_string(), chars: text.chars().collect() }
    }
}

// ここに impl<T> Container for Stack<T> と impl Container for Letters を書く

fn last_item<C: Container>(c: &C) -> Option<&C::Item> {
    todo!()
}
`,
  solutionCode: `trait Container {
    type Item;
    fn get(&self, i: usize) -> Option<&Self::Item>;
    fn first(&self) -> Option<&Self::Item>;
    fn len(&self) -> usize;
}

struct Stack<T> {
    items: Vec<T>,
}

struct Letters {
    text: String,
    chars: Vec<char>,
}

impl Letters {
    fn new(text: &str) -> Letters {
        Letters { text: text.to_string(), chars: text.chars().collect() }
    }
}

impl<T> Container for Stack<T> {
    type Item = T;

    fn get(&self, i: usize) -> Option<&T> {
        self.items.get(i)
    }

    fn first(&self) -> Option<&T> {
        self.get(0)
    }

    fn len(&self) -> usize {
        self.items.len()
    }
}

impl Container for Letters {
    type Item = char;

    fn get(&self, i: usize) -> Option<&char> {
        self.chars.get(i)
    }

    fn first(&self) -> Option<&char> {
        self.get(0)
    }

    fn len(&self) -> usize {
        self.chars.len()
    }
}

fn last_item<C: Container>(c: &C) -> Option<&C::Item> {
    if c.len() == 0 {
        None
    } else {
        c.get(c.len() - 1)
    }
}
`,
});
