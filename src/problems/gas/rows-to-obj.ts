import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "write-gas-rows-to-obj",
  stage: "write",
  scenario: "gas",
  copy: {
    title: "シートデータをオブジェクト配列に変換しよう",
    prompt: `## やること

GAS で \`getValues()\` したデータ（先頭行がヘッダー、2行目以降がデータ）を、
**オブジェクトの配列**に変換する関数 \`solve\` を書こう。

\`\`\`ts
solve([
  ["name", "price"],   // ← ヘッダー行
  ["りんご", "120"],
  ["バナナ", "80"],
])
// → [{ name: "りんご", price: "120" }, { name: "バナナ", price: "80" }]
\`\`\`

## 考え方

1. 先頭行（\`data[0]\`）をヘッダーとして取り出す
2. 残りの行（\`data.slice(1)\` または分割代入）をデータとしてループ
3. 各行を \`headers\` の順に対応付けてオブジェクトを作る

\`\`\`ts
const [headers, ...rows] = data;
return rows.map((row) => {
  const obj: Record<string, string> = {};
  headers.forEach((h, i) => { obj[h] = row[i]; });
  return obj;
});
\`\`\`

## 型のヒント

\`\`\`ts
function solve(data: string[][]): Record<string, string>[] { ... }
\`\`\``,
    hints: [
      "`const [headers, ...rows] = data;` で先頭行とそれ以外を分割できる",
      "`headers.forEach((h, i) => { obj[h] = row[i]; })` でインデックスを使って対応付け",
      "`rows.map(...)` で全データ行をオブジェクトに変換した配列を作れる",
    ],
  },
  initialCode: `// 白紙から書いてみよう！
// function solve(data: string[][]): Record<string, string>[] { ... }
`,
  solutionCode: `function solve(data: string[][]): Record<string, string>[] {
  const [headers, ...rows] = data;
  return rows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}
`,
});
