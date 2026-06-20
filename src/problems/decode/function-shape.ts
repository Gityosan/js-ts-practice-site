import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "decode-function-shape",
  stage: "decode",
  scenario: "basic",
  copy: {
    title: "関数の骨格を読む",
    prompt: `## ( ) と { } は、直前の予約語が意味を決める

\`( )\` も \`{ }\` も、JS では何通りもの意味を持つ。
でも **直前の予約語を見れば、意味は1つに確定する**。これが「手前から読む」コツ。

- \`function\` の直後の \`( )\` → **引数の定義**
- \`)\` の直後の \`{ }\` → **関数の本体**
- \`: number\` → 型注釈（飾り。読み飛ばしてOK）

右のコードの \`(\` と \`{\` をクリックして、確定した意味を確かめよう。`,
    hints: [
      "function の直後の ( ) は「中に何を受け取るか」を定義している。",
      "型注釈 `: number` は「ここは数値ですよ」という飾り。消しても動く。",
    ],
  },
  decode: {
    code: `function double(n: number): number {
  return n * 2;
}`,
    quiz: [
      {
        prompt: "この `( )` の意味は？",
        snippet: `function double(n: number)`,
        choices: ["引数の定義", "関数の呼び出し", "条件式"],
        answer: "引数の定義",
        explain:
          "直前が `function`（正確には `function 名前`）なので、この ( ) は『この関数が受け取る引数の定義』。呼び出しではない。",
      },
      {
        prompt: "この `{ }` の意味は？",
        snippet: `): number {
  return n * 2;
}`,
        choices: ["関数の本体", "オブジェクトリテラル", "条件式"],
        answer: "関数の本体",
        explain: "引数定義の `)` の直後に来る `{ }` は『関数の本体』。中の処理が実行される。",
      },
      {
        prompt: "`: number` は何？",
        snippet: `(n: number): number`,
        choices: ["型注釈（飾り）", "計算", "予約語"],
        answer: "型注釈（飾り）",
        explain:
          "`: number` は「ここは数値ですよ」という TypeScript の型注釈。読むときは飾りとして読み飛ばしてよく、消しても JS としては動く。",
      },
    ],
  },
});
