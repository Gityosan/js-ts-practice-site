import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "learn-class",
  stage: "learn",
  scenario: "basic",
  copy: {
    title: "class",
    prompt: `## データと操作をまとめる設計図

\`class\` は「同じ形のデータと、それを扱う関数」をまとめた設計図。

\`\`\`ts
class Counter {
  count = 0;              // プロパティ（持つデータ）

  constructor(start) {    // new したとき最初に動く
    this.count = start;
  }

  increment() {           // メソッド（できる操作）
    this.count = this.count + 1;
  }
}

const c = new Counter(10); // 設計図から実体を作る
c.increment();
c.count                    // → 11
\`\`\`

- \`new\` … 設計図から**実体（インスタンス）**を作る
- \`constructor\` … 作られた瞬間に走る**初期化**
- メソッド … クラスの中に書く**関数**。\`this\` で自分のデータを指す`,
    hints: [
      "new でインスタンスを作る。",
      "constructor は生成時に一度だけ呼ばれる初期化用の特別なメソッド。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "クラスから実体（インスタンス）を作るキーワードは？",
        choices: ["new", "class", "this"],
        answer: "new",
        explain: "`new Counter(10)` のように `new` で実体を作る。",
      },
      {
        prompt: "生成時に最初に走る初期化用の特別なメソッドは？",
        choices: ["constructor", "increment", "init"],
        answer: "constructor",
        explain: "`constructor` は new したときに一度だけ呼ばれ、初期値などを設定する。",
      },
      {
        prompt: "クラスの中に書く関数（できる操作）を何と呼ぶ？",
        choices: ["メソッド", "プロパティ", "インスタンス"],
        answer: "メソッド",
        explain: "クラス内の関数はメソッド。データの方はプロパティと呼ぶ。",
      },
    ],
  },
});
