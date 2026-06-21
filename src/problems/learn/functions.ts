import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "learn-functions",
  stage: "learn",
  scenario: "basic",
  copy: {
    title: "関数の種類を知る",
    prompt: `## 同じ関数を3通りで

\`\`\`ts
// ① function 宣言
function double(n) {
  return n * 2;
}

// ② アロー関数
const double = (n) => {
  return n * 2;
};

// ③ アロー＋return省略（本体が式1つだけなら return も { } も省ける）
const double = (n) => n * 2;
\`\`\`

①②③は**どれも同じ働き**。アローは短く書けるのが利点。

## カリー化（関数を返す関数）

引数を1つずつ受け取る形。\`=>\` を続けて書く。

\`\`\`ts
const add = (a) => (b) => a + b;
add(1)(2)   // → 3
\`\`\`

\`add(1)\` が「1を足す関数」を返し、それに \`(2)\` を渡して 3。`,
    hints: [
      "アロー関数で本体が式1つなら `=> 式` だけで return される。",
      "カリー化は `f(1)(2)` のように ( ) を続けて呼ぶ。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "`const double = (n) => n * 2;` には return がある？",
        snippet: `const double = (n) => n * 2;`,
        choices: ["ある（省略されている）", "ない（何も返さない）"],
        answer: "ある（省略されている）",
        explain: "アロー関数で本体が式1つだけのときは return と { } を省略でき、その式の値が返る。",
      },
      {
        prompt: "`function f(){}` と `const f = () => {}` の関係で正しいのは？",
        choices: ["どちらも関数。アローは短く書ける", "アローは関数ではない", "全く別の機能"],
        answer: "どちらも関数。アローは短く書ける",
        explain: "両方とも関数。アロー関数は記法が短く、書き方が違うだけ。",
      },
      {
        prompt: "`const add = (a) => (b) => a + b;` を呼んで 3 を得るには？",
        snippet: `const add = (a) => (b) => a + b;`,
        choices: ["add(1)(2)", "add(1, 2)", "add(3)"],
        answer: "add(1)(2)",
        explain: "カリー化された関数。`add(1)` が関数を返し、それに `(2)` を渡して 1 + 2 = 3。",
      },
    ],
  },
});
