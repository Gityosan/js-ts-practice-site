import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "decode-operators",
  stage: "decode",
  scenario: "basic",
  copy: {
    title: "比較と論理の記号を読む",
    prompt: `## 条件の中の記号を分解する

\`if ( )\` の中身は「真か偽か」を判定する式。よく出る記号はこの2種類：

- **比較**：\`>\` \`>=\` \`<\` \`===\`（大小や等しいかを調べる）
- **論理**：\`&&\`（かつ）\`||\`（または）

\`age >= 18 && hasTicket\` は「18歳以上 **かつ** チケットあり」と読める。
右のコードの記号をクリックして、意味を確かめよう。`,
    hints: [
      "`>=` は「以上」。`===` は「型も値も等しい」。",
      "`&&` は両方が真のときだけ真。`||` はどちらか一方でも真なら真。",
    ],
  },
  decode: {
    code: `if (age >= 18 && hasTicket) {
  enter();
}`,
    quiz: [
      {
        prompt: "`>=` の意味は？",
        snippet: `age >= 18`,
        choices: ["以上（age が 18 以上か）", "代入（age に 18 を入れる）", "等しい"],
        answer: "以上（age が 18 以上か）",
        explain: "`>=` は比較演算子で「以上」。`age >= 18` は「age が 18 以上か？」を真偽で返す。",
      },
      {
        prompt: "`&&` の意味は？",
        snippet: `age >= 18 && hasTicket`,
        choices: ["かつ（両方が真なら真）", "または（どちらかが真なら真）", "足し算"],
        answer: "かつ（両方が真なら真）",
        explain: "`&&` は論理演算子の「かつ」。左右の両方が真のときだけ全体が真になる。",
      },
      {
        prompt: "`enter()` の `( )` の意味は？",
        snippet: `enter();`,
        choices: ["関数の呼び出し", "条件式", "グループ化"],
        answer: "関数の呼び出し",
        explain: "名前（enter）の直後の ( ) は『呼び出し』。条件が真のとき enter を実行する。",
      },
    ],
  },
});
