import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fmt-write-debug",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "write! で文字列を組み立て、Debug を手で実装する",
    prompt: `## やること

### 1. \`receipt(items: &[(&str, u32)]) -> String\`

\`std::fmt::Write\` の \`writeln!\` を使って、1 つの \`String\` にレシートを書き込んで返そう。各行は \`品名\` を幅 6 の左寄せ、金額を幅 5 の右寄せにし、最後に合計行を付ける。

\`\`\`text
pen   |  120
note  |  300
TOTAL |  420
\`\`\`

（各行末に改行 \`\\n\` が付く。空のときは \`TOTAL |    0\\n\` だけ）

### 2. \`Secret\` に Debug を手で実装する

\`Secret { user: String, token: String }\` を \`{:?}\` で表示したとき、token を隠して次のように表示されるようにしよう。

\`\`\`text
Secret { user: "alice", token: "***" }
\`\`\`

\`f.debug_struct("Secret").field("user", &self.user).field("token", &"***").finish()\` を使うと簡単。`,
    hints: [
      '`use std::fmt::Write;` を書いてから `writeln!(out, "{:<6}|{:>5}", name, price).unwrap();`',
      "合計は for 文の中で足しておく",
      "Debug は `f.debug_struct(...)` を使うと derive と同じ形式で出力される",
    ],
  },
  initialCode: `use std::fmt;
use std::fmt::Write;

fn receipt(items: &[(&str, u32)]) -> String {
    let mut out = String::new();
    todo!()
}

struct Secret {
    user: String,
    token: String,
}

impl fmt::Debug for Secret {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}
`,
  solutionCode: `use std::fmt;
use std::fmt::Write;

fn receipt(items: &[(&str, u32)]) -> String {
    let mut out = String::new();
    let mut total = 0;
    for (name, price) in items {
        writeln!(out, "{:<6}|{:>5}", name, price).unwrap();
        total += price;
    }
    writeln!(out, "{:<6}|{:>5}", "TOTAL", total).unwrap();
    out
}

struct Secret {
    user: String,
    token: String,
}

impl fmt::Debug for Secret {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.debug_struct("Secret")
            .field("user", &self.user)
            .field("token", &"***")
            .finish()
    }
}
`,
});
