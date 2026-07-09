import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "learn-types",
  stage: "learn",
  scenario: "basic",
  copy: {
    title: "type と interface を知る",
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

ざっくり：**interface は extends**、**type は &** で「足し合わせる」。

## \`?\` は「あってもなくてもいい」項目

プロパティ名のうしろに \`?\` を付けると **省略可能（オプショナル）**になる。
その項目の型は「指定した型 **または undefined**」になる。

\`\`\`ts
type User = { name: string; age?: number };

const a: User = { name: "田中", age: 20 }; // OK
const b: User = { name: "佐藤" };          // OK（age を省略できる）
// b.age の型は number | undefined
\`\`\`

## 同じ項目を違う型で重ねると？

\`&\` で**同じ名前の項目を違う型**にすると、「両方を同時に満たす値」が必要になる。
だが \`number\` でも \`string\` でもある値は存在しないので、その項目は **\`never\`（あり得ない型）**になる。

\`\`\`ts
type T = { id: number } & { id: string };
// id は number かつ string → そんな値は無い → id: never
\`\`\`

同じ型どうし（例：\`{ id: number } & { id: number }\`）なら、そのまま \`number\` のまま。

## \`|\` は「どれか一つ」（ユニオン型）

\`&\`（両方を満たす）に対して、\`|\` は **いずれか一つ**を表す。値の候補を並べる（or 列挙）。

\`\`\`ts
type Answer = "yes" | "no" | "maybe"; // この3つのどれか
type Id = number | string;            // 数値か文字列のどちらか
\`\`\`

## \`?\` と \`| undefined\` の違い

どちらも値の型に undefined が入るが、**キーを省略できるか**が違う。

\`\`\`ts
type A = { age?: number };            // age は任意項目
type B = { age: number | undefined }; // age は必須（値が undefined でも書く）

const a: A = {};                  // OK（age を省略できる）
const b: B = {};                  // ✗ エラー（age が無い）
const b2: B = { age: undefined }; // OK
\`\`\`

- \`?\` … **キー自体を省略してよい**（任意）
- \`| undefined\` … **キーは必須**。値は undefined でもよいが、書かないとエラー`,
    hints: [
      "type も interface も、型に名前をつけるための仕組み。",
      "interface の継承は extends、type の合成は &（交差型）。",
      "`?` は省略可能。その型は「指定型 | undefined」になる。",
      "& で同名項目を違う型にすると、両立できないので never になる。",
      "`|` はユニオン（どれか一つ）。`&`（両方）と対。",
      "`?` はキーを省略できる／`| undefined` はキー必須で値だけ undefined 可。",
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
        explain:
          "`&` は交差型。両方のプロパティを併せ持つ型になる。`|` は「どちらか」の意味で別物。",
      },
      {
        prompt: "`age?: number` のとき、`age` の型はどうなる？",
        snippet: `type User = { name: string; age?: number };`,
        choices: ["number | undefined", "number", "undefined だけ"],
        answer: "number | undefined",
        explain:
          "`?` は省略可能の印。値があれば number、無ければ undefined なので `number | undefined`。",
      },
      {
        prompt: "`{ id: number } & { id: string }` の `id` の型は？",
        snippet: `type T = { id: number } & { id: string };`,
        choices: ["never", "number", "string", "number | string"],
        answer: "never",
        explain:
          "& は「両方を満たす」型。number かつ string の値は存在しないので、重なった id は never（あり得ない型）になる。",
      },
      {
        prompt: "`|`（ユニオン型）の意味は？",
        snippet: `type Id = number | string;`,
        choices: ["並べた型のどれか一つ", "並べた型を全部同時に満たす", "省略可能"],
        answer: "並べた型のどれか一つ",
        explain:
          "`|` はユニオン。`number | string` は「数値か文字列のどちらか」。両方を満たす `&` と対になる。",
      },
      {
        prompt: "`age?: number` と `age: number | undefined` の違いで正しいのは？",
        choices: [
          "? はキーを省略できる／| undefined はキー必須",
          "意味は完全に同じ",
          "| undefined の方がキーを省略できる",
        ],
        answer: "? はキーを省略できる／| undefined はキー必須",
        explain:
          "どちらも値の型に undefined を含むが、`?` はキー自体を省略可。`| undefined` はキーが必須で、書かないとエラー（値は undefined でよい）。",
      },
    ],
  },
});
