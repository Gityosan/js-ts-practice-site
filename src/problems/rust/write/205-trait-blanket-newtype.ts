import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-trait-blanket-newtype",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ブランケット実装と孤児ルール（ニュータイプ）",
    prompt: `## やること

### 1. ブランケット実装

自作トレイト \`Describe\` を、**Debug を実装したすべての型** にまとめて実装しよう。

\`\`\`rust
trait Describe {
    fn describe(&self) -> String;   // "<{:?}>" の形
}
impl<T: Debug> Describe for T { ... }
\`\`\`

\`\`\`rust
42.describe()           // "<42>"
vec![1, 2].describe()   // "<[1, 2]>"
\`\`\`

### 2. 自作トレイト × 外部の型

自作トレイト \`Total\` を標準ライブラリの \`Vec<i32>\` に実装しよう（トレイトが自作なので OK）。

\`\`\`rust
trait Total { fn total(&self) -> i32; }   // 要素の合計
vec![1, 2, 3].total()   // 6
\`\`\`

### 3. 外部トレイト × 外部の型 → ニュータイプ

\`Display\` を \`Vec<String>\` に直接実装するのは **孤児ルール** で禁止されている。そこで自作の型 \`Words(Vec<String>)\` で包んで、\`Display\` を実装しよう。表示は単語をスペース 1 つで連結したもの。

\`\`\`rust
Words(vec!["a".to_string(), "b".to_string()]).to_string()  // "a b"
\`\`\`

Display を実装すると、ブランケット実装のおかげで \`.to_string()\` が自動で使える。`,
    hints: [
      '`impl<T: Debug> Describe for T { fn describe(&self) -> String { format!("<{:?}>", self) } }`',
      "Total は `self.iter().sum()` か for ループで合計",
      'Display は `fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { write!(f, "{}", self.0.join(" ")) }`',
    ],
  },
  initialCode: `use std::fmt::{self, Debug};

trait Describe {
    fn describe(&self) -> String;
}

// ここに Debug を実装したすべての型への Describe の実装を書く
impl<T: Debug> Describe for T {
    fn describe(&self) -> String {
        todo!()
    }
}

trait Total {
    fn total(&self) -> i32;
}

impl Total for Vec<i32> {
    fn total(&self) -> i32 {
        todo!()
    }
}

struct Words(Vec<String>);

impl fmt::Display for Words {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}
`,
  solutionCode: `use std::fmt::{self, Debug};

trait Describe {
    fn describe(&self) -> String;
}

impl<T: Debug> Describe for T {
    fn describe(&self) -> String {
        format!("<{:?}>", self)
    }
}

trait Total {
    fn total(&self) -> i32;
}

impl Total for Vec<i32> {
    fn total(&self) -> i32 {
        let mut sum = 0;
        for x in self {
            sum += x;
        }
        sum
    }
}

struct Words(Vec<String>);

impl fmt::Display for Words {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0.join(" "))
    }
}
`,
});
