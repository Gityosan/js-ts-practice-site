import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "learn-types",
  stage: "learn",
  scenario: "basic",
  copy: {
    title: "type と interface",
    prompt: `## 「型」に名前をつける

オブジェクトの形（どんなプロパティを持つか）に名前をつけられる。\`type\` でも \`interface\` でも書ける。

\`\`\`ts
type User = { name: string; age: number };

interface User2 {
  name: string;
  age: number;
}
\`\`\`

## 合成する

既存の型を組み合わせて新しい型を作れる。

\`\`\`ts
// interface は extends で引き継ぐ
interface Admin extends User2 {
  role: string;
}

// type は & （交差型）で合体
type Admin2 = User & { role: string };
\`\`\`

ざっくり：**interface は extends**、**type は &** で「足し合わせる」。`,
    hints: [
      "type も interface も、型に名前をつけるための仕組み。",
      "interface の継承は extends、type の合成は &（交差型）。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: "型に名前をつけられるのは？",
        choices: ["type と interface の両方", "type だけ", "interface だけ"],
        answer: "type と interface の両方",
        explain: "どちらでもオブジェクトの形に名前をつけられる。使い分けはあるが基本は同等。",
      },
      {
        prompt: "interface で別の型を引き継ぐキーワードは？",
        snippet: `interface Admin ____ User { role: string }`,
        choices: ["extends", "&", "implements"],
        answer: "extends",
        explain: "interface の継承は `extends`。`interface Admin extends User { ... }`。",
      },
      {
        prompt: "type で複数の型を合体させる記号は？",
        snippet: `type Admin = User ___ { role: string };`,
        choices: ["&", "extends", "|"],
        answer: "&",
        explain: "`&` は交差型。両方のプロパティを併せ持つ型になる。`|` は「どちらか」の意味で別物。",
      },
    ],
  },
});
