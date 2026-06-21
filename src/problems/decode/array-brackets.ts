import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "decode-array-brackets",
  stage: "decode",
  scenario: "basic",
  copy: {
    title: "[ ] はリスト？ それとも番号取り出し？",
    prompt: `## [ ] にも2つの顔がある

\`{ }\` と同じで、\`[ ]\` も手前を見れば意味が決まる。

- \`=\` などの直後の \`[ ]\` → **配列リテラル**（値を並べてリストを作る）
- **名前の直後**の \`[ ]\` → **要素アクセス**（何番目かを取り出す）

右のコードの2つの \`[ ]\` をクリックして、顔の違いを確かめよう。`,
    hints: [
      "`= [ ... ]` は値を作っている（配列リテラル）。",
      "`名前[0]` は「0 番目を取り出す」アクセス。先頭は 0 から数える。",
    ],
  },
  decode: {
    code: `const scores = [80, 95, 70];
const first = scores[0];`,
    quiz: [
      {
        prompt: "1行目の `[ ]` の意味は？",
        snippet: `const scores = [80, 95, 70];`,
        choices: ["配列リテラル（リストを作る）", "要素アクセス（取り出す）"],
        answer: "配列リテラル（リストを作る）",
        explain: "`=` の直後の [ ] は『配列リテラル』。値を並べてリスト（配列）を作っている。",
      },
      {
        prompt: "2行目の `[0]` の意味は？",
        snippet: `const first = scores[0];`,
        choices: ["要素アクセス（取り出す）", "配列リテラル（リストを作る）"],
        answer: "要素アクセス（取り出す）",
        explain:
          "名前（scores）の直後の [ ] は『要素アクセス』。`[0]` は先頭（0 番目）の値を取り出す。",
      },
    ],
  },
});
