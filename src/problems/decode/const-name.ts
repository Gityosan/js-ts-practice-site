import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "decode-const-name",
  stage: "decode",
  scenario: "basic",
  copy: {
    title: "予約語と「自分の名前」を見分ける",
    prompt: `## コードは2種類の言葉でできている

プログラムの1行は、たった2種類の言葉でできている。

- **予約語**（紫）… JS が最初から決めている、構造を作る言葉。数は有限。
- **自分で付けた名前**（水色）… 変数名・関数名。無限に作れて、意味を運ぶ。

右のコードの言葉を **クリック** して、どっちがどっちか確かめよう。
**骨格を読むだけなら、水色（名前）の中身は気にしなくていい。**`,
    hints: [
      "紫の言葉（const）は暗記する対象。種類は限られている。",
      "水色の言葉（total・price）は作者が好きに付けた名前。別の名前でも動く。",
    ],
  },
  decode: {
    code: `const total = price * 2;`,
    quiz: [
      {
        prompt: "`total` は予約語？ それとも自分で付けた名前？",
        choices: ["予約語", "自分で付けた名前"],
        answer: "自分で付けた名前",
        explain:
          "`total` は作者が好きに付けた名前（open-class）。`合計` でも `x` でも動く。一方 `const` は JS が決めた予約語で、別の語に変えられない。",
      },
      {
        prompt: "次のうち、予約語（構造を作る言葉）はどれ？",
        snippet: `const total = price * 2;`,
        choices: ["const", "total", "price"],
        answer: "const",
        explain: "`const` だけが予約語。`total` と `price` は作者が付けた名前。",
      },
    ],
  },
});
