import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-read-format-width",
  stage: "read",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "書式指定で表を揃える",
    prompt: `## まず実行してみよう

**▶ 実行** を押すと、Rust Playground でコンパイル・実行されて、下の「出力プレビュー」に結果が出る（数秒かかる）。

幅（\`8\`）や精度（\`.2\`）の数字を変えて、表示の揃い方を見よう。

## コードを読んでみよう

\`\`\`rust
println!("[{:>8}]", "右");
println!("[{:<8}]", "左");
println!("[{:^8}]", "中");
println!("{:.2}", 3.14159);
\`\`\`

- \`{:>8}\` 右寄せ・幅 8、\`{:<8}\` 左寄せ、\`{:^8}\` 中央寄せ
- \`{:08}\` は 0 で埋めて幅 8
- \`{:.2}\` は小数点以下 2 桁
- \`{:x}\` は 16 進数、\`{:b}\` は 2 進数`,
    hints: [
      "`8` を `12` にしてみよう",
      "`.2` を `.4` にすると桁が増える",
      "`{:b}` の数字を変えて 2 進数を見よう",
    ],
  },
  initialCode: `fn main() {
    println!("[{:>8}]", "右"); // ← 幅の数字を変えて ▶ 実行！
    println!("[{:<8}]", "左");
    println!("[{:^8}]", "中");
    println!("[{:08}]", 42);
    println!("円周率は {:.2}", 3.14159); // ← .2 を変えてみよう
    println!("255 は 16 進数で {:x}、2 進数で {:b}", 255, 255);

    let items = [("りんご", 120), ("ぶどう", 480), ("もも", 300)];
    for (name, price) in items {
        println!("{:<6}{:>6}円", name, price);
    }
}
`,
  solutionCode: `fn main() {
    println!("[{:>8}]", "右"); // ← 幅の数字を変えて ▶ 実行！
    println!("[{:<8}]", "左");
    println!("[{:^8}]", "中");
    println!("[{:08}]", 42);
    println!("円周率は {:.2}", 3.14159); // ← .2 を変えてみよう
    println!("255 は 16 進数で {:x}、2 進数で {:b}", 255, 255);

    let items = [("りんご", 120), ("ぶどう", 480), ("もも", 300)];
    for (name, price) in items {
        println!("{:<6}{:>6}円", name, price);
    }
}
`,
});
