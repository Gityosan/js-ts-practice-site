import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-unit-functions-stdout",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "値を返さない関数を作って main から呼ぶ",
    prompt: `## やること

**\`fn main\` を含むプログラム全体** を書こう。次の 2 つの関数を作り、\`main\` から呼び出して表示する。

- \`greet(name: &str)\` … \`Hello, 名前!\` と 1 行表示する
- \`print_sum(a: i32, b: i32)\` … \`a + b = 和\` の形で 1 行表示する

\`main\` では次の順に呼ぶ。

\`\`\`rust
greet("Alice");
greet("Bob");
print_sum(2, 3);
print_sum(-1, 10);
\`\`\`

## 期待する出力

\`\`\`text
Hello, Alice!
Hello, Bob!
2 + 3 = 5
-1 + 10 = 9
\`\`\`

## ポイント

- 戻り値の型 \`->\` を書かない関数は \`()\` を返す（表示が目的の関数）
- \`&str\` は文字列を受け取る引数の型（スライスの章で詳しく学ぶ）
- \`println!("{a} + {b} = {}", a + b);\` のように、変数名と \`{}\` を混ぜて使える`,
    hints: [
      '`fn greet(name: &str) { println!("Hello, {name}!"); }`',
      '`fn print_sum(a: i32, b: i32) { println!("{a} + {b} = {}", a + b); }`',
    ],
  },
  initialCode: `// greet と print_sum を定義しよう

fn main() {
    // greet と print_sum を呼び出そう
}
`,
  solutionCode: `fn greet(name: &str) {
    println!("Hello, {name}!");
}

fn print_sum(a: i32, b: i32) {
    println!("{a} + {b} = {}", a + b);
}

fn main() {
    greet("Alice");
    greet("Bob");
    print_sum(2, 3);
    print_sum(-1, 10);
}
`,
});
