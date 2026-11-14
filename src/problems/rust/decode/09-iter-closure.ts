import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-decode-iter-closure",
  stage: "decode",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "イテレータのメソッドチェーンを左から読む",
    prompt: `## 左から順に「流れ作業」

\`\`\`rust
let squares: Vec<i32> = nums
    .iter()
    .filter(|x| **x % 2 == 0)
    .map(|x| x * x)
    .collect();
\`\`\`

- \`nums.iter()\` … 要素を 1 つずつ（参照で）流すイテレータを作る
- \`.filter(|x| ...)\` … 条件が真のものだけ通す。\`|x|\` はクロージャの引数
- \`.map(|x| x * x)\` … 1 つずつ変換する
- \`.collect()\` … 流れてきたものを集めてコレクションにする。何に集めるかは左の型注釈 \`Vec<i32>\` で決まる
- \`**x\` … filter には「参照の参照」が渡されるので、\`*\` を 2 回付けて値を取り出している

メソッドの \`.\` を左から順にクリックして、1 段ずつ読もう。`,
    hints: [
      "`.` でつながったメソッドは左から順に実行される。",
      "`|x|` がクロージャの引数、その右が本体。",
      "`collect` の行き先は型注釈で決まる。",
    ],
  },
  decode: {
    code: `let squares: Vec<i32> = nums
    .iter()
    .filter(|x| **x % 2 == 0)
    .map(|x| x * x)
    .collect();`,
    quiz: [
      {
        prompt: "最初に実行されるメソッドは？",
        choices: ["iter", "filter", "map", "collect"],
        answer: "iter",
        explain: "メソッドチェーンは左（上）から順に実行される。",
      },
      {
        prompt: "`|x| x * x` の `|x|` は何？",
        choices: ["クロージャの引数", "絶対値", "ビット OR"],
        answer: "クロージャの引数",
        explain: "`|引数| 本体` の形のクロージャ。x を受け取って x * x を返す。",
      },
      {
        prompt: "`nums` が `[1, 2, 3, 4]` のとき、`squares` は？",
        choices: ["[4, 16]", "[1, 4, 9, 16]", "[2, 4]"],
        answer: "[4, 16]",
        explain: "filter で偶数（2, 4）だけ残し、map で 2 乗して [4, 16]。",
      },
      {
        prompt: "`collect()` が Vec に集めると分かるのは？",
        choices: [
          "左の型注釈 `Vec<i32>` から",
          "collect は必ず Vec を返すから",
          "nums が Vec だから",
        ],
        answer: "左の型注釈 `Vec<i32>` から",
        explain:
          "collect は何にでも集められる。行き先は型注釈（または `collect::<Vec<_>>()`）で指定する。",
      },
    ],
  },
});
