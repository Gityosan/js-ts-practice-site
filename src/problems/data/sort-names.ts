import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-sort-names",
  stage: "fill",
  scenario: "data",
  copy: {
    title: "データを並べ替えよう",
    prompt: `## やること

文字列の配列を受け取って、**辞書順（abc/あいうえお順）に並べた新しい配列**を返す関数 \`solve\` を完成させよう。
元の配列は変えないこと。

\`\`\`ts
solve(["Charlie", "Alice", "Bob"])
// → ["Alice", "Bob", "Charlie"]
\`\`\`

## ヒント: sort の骨格

\`\`\`
[...配列].sort()         // 文字列なら引数なしで辞書順
[...配列].sort((a, b) => ...) // 数値や複雑な順序のとき
\`\`\`

\`[...names]\` はコピーを作る（元の配列を壊さないため）。`,
    hints: [
      "`[...names].sort()` — スプレッドでコピーしてから並べ替え",
      "文字列の `sort()` は引数なしで辞書順（a-z, あいう）になる",
      "`names.sort()` だと元の配列が変わってしまうのでコピーが必要",
    ],
  },
  initialCode: `function solve(names: string[]): string[] {
  // ここに書こう

}`,
  solutionCode: `function solve(names: string[]): string[] {
  return [...names].sort();
}`,
});
