import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-dyn-plugin-pipeline",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "プラグインのパイプライン",
    prompt: `## やること

数値を順に変換していく **パイプライン** を作ろう。変換器（プラグイン）は後から何種類でも追加できるよう、\`Box<dyn Plugin>\` で持つ。

\`\`\`rust
trait Plugin {
    fn name(&self) -> String;
    fn apply(&self, x: i64) -> i64;
}
\`\`\`

用意するプラグイン:

| 型 | name | apply |
|---|---|---|
| \`AddN(i64)\` | \`"add 3"\` のように | \`x + n\` |
| \`MulN(i64)\` | \`"mul 2"\` のように | \`x * n\` |
| \`Clamp { min, max }\` | \`"clamp 0..10"\` のように | \`min\` 〜 \`max\` の範囲に収める |

\`Pipeline\`:

- \`Pipeline::new()\`
- \`add<P: Plugin + 'static>(&mut self, p: P)\` … ジェネリクスで受け取り、\`Box::new\` して内部の Vec に入れる
- \`run(&self, x: i64) -> i64\` … 追加した順に \`apply\` を適用
- \`names(&self) -> Vec<String>\` … プラグイン名の一覧

\`\`\`rust
let mut p = Pipeline::new();
p.add(AddN(3));
p.add(MulN(2));
p.add(Clamp { min: 0, max: 10 });
p.run(1)   // (1 + 3) * 2 = 8
p.run(9)   // 24 → 10
p.names()  // ["add 3", "mul 2", "clamp 0..10"]
\`\`\``,
    hints: [
      "`struct Pipeline { plugins: Vec<Box<dyn Plugin>> }`",
      "`self.plugins.push(Box::new(p));` — ジェネリクスの `P` が `Box<dyn Plugin>` に変換される。`'static` が要るのは `Box<dyn Plugin>` が `Box<dyn Plugin + 'static>` の省略形だから。",
      "`run` は `self.plugins.iter().fold(x, |acc, p| p.apply(acc))`。`Clamp` は `x.clamp(self.min, self.max)` が使える。",
    ],
  },
  initialCode: `trait Plugin {
    fn name(&self) -> String;
    fn apply(&self, x: i64) -> i64;
}

struct AddN(i64);
struct MulN(i64);
struct Clamp {
    min: i64,
    max: i64,
}

// ここに 3 つの impl Plugin を書く

struct Pipeline {
    plugins: Vec<Box<dyn Plugin>>,
}

impl Pipeline {
    fn new() -> Pipeline {
        Pipeline { plugins: Vec::new() }
    }

    fn add<P: Plugin + 'static>(&mut self, p: P) {
        todo!()
    }

    fn run(&self, x: i64) -> i64 {
        todo!()
    }

    fn names(&self) -> Vec<String> {
        todo!()
    }
}
`,
  solutionCode: `trait Plugin {
    fn name(&self) -> String;
    fn apply(&self, x: i64) -> i64;
}

struct AddN(i64);
struct MulN(i64);
struct Clamp {
    min: i64,
    max: i64,
}

impl Plugin for AddN {
    fn name(&self) -> String { format!("add {}", self.0) }
    fn apply(&self, x: i64) -> i64 { x + self.0 }
}

impl Plugin for MulN {
    fn name(&self) -> String { format!("mul {}", self.0) }
    fn apply(&self, x: i64) -> i64 { x * self.0 }
}

impl Plugin for Clamp {
    fn name(&self) -> String { format!("clamp {}..{}", self.min, self.max) }
    fn apply(&self, x: i64) -> i64 { x.clamp(self.min, self.max) }
}

struct Pipeline {
    plugins: Vec<Box<dyn Plugin>>,
}

impl Pipeline {
    fn new() -> Pipeline {
        Pipeline { plugins: Vec::new() }
    }

    fn add<P: Plugin + 'static>(&mut self, p: P) {
        self.plugins.push(Box::new(p));
    }

    fn run(&self, x: i64) -> i64 {
        self.plugins.iter().fold(x, |acc, p| p.apply(acc))
    }

    fn names(&self) -> Vec<String> {
        self.plugins.iter().map(|p| p.name()).collect()
    }
}
`,
});
