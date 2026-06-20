import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "decode-object-vs-block",
  stage: "decode",
  scenario: "basic",
  copy: {
    title: "{ } はオブジェクト？ それともブロック？",
    prompt: `## 一番まぎらわしい { } を見分ける

\`{ }\` は2つの顔を持つ。手前を見れば必ず見分けられる。

- \`=\` の直後の \`{ }\` → **オブジェクトリテラル**（値。中は キー: 値）
- \`)\` や \`=>\` の直後の \`{ }\` → **本体・ブロック**（処理）

下のコードには \`{ }\` が2つある。クリックして、それぞれの顔を確かめよう。`,
    hints: [
      "`= {` は値を作っている（オブジェクト）。中は `名前: 値` の形。",
      "`=> {` や `) {` は処理のまとまり（本体）。中は実行される文。",
    ],
  },
  decode: {
    code: `const user = { name: "田中", age: 20 };
const greet = () => {
  return user.name;
};`,
    quiz: [
      {
        prompt: "1行目の `{ }` の意味は？",
        snippet: `const user = { name: "田中", age: 20 };`,
        choices: ["オブジェクトリテラル（値）", "関数の本体", "ブロック"],
        answer: "オブジェクトリテラル（値）",
        explain:
          "`=` の直後の { } は『オブジェクトリテラル』。`name: \"田中\"` のように キー: 値 を並べてデータを作っている。",
      },
      {
        prompt: "2行目の `=> { }` の意味は？",
        snippet: `const greet = () => {
  return user.name;
};`,
        choices: ["関数の本体", "オブジェクトリテラル", "条件式"],
        answer: "関数の本体",
        explain: "アロー `=>` の直後の { } は『関数の本体』。中の処理（return）が実行される。",
      },
    ],
  },
});
