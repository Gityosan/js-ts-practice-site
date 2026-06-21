import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-gas-conditional-sum",
  stage: "write",
  scenario: "gas",
  copy: {
    title: "合計を計算する④",
    prompt: `## やること

Google Apps Script（GAS）で、スプレッドシートの **B2〜B5 の値のうち 1000 以上のものだけを合計**し、**B6 にセット**するコードを書こう。

スプレッドシートのデータ（モック）:
| | B |
|---|---|
| 2 | 1200 |
| 3 | 800 |
| 4 | 1500 |
| 5 | 600 |
| **6** | **← 2700 を入れる（1200 + 1500）** |

## 考え方

\`getValues()\` で取れる配列（例: \`[[1200], [800], [1500], [600]]\`）に対して、
**まず \`filter\`** で「1000 以上の行」だけに絞り、**次に \`reduce\`** で合計する2段構え。
各行の値は \`row[0]\` で取り出せる。`,
    hints: [
      "`values.filter((row) => row[0] >= 1000)` で 1000 以上の行だけに絞れる",
      "`.reduce((acc, row) => acc + row[0], 0)` で合計できる",
      "`sheet.getRange(\"B6\").setValue(total)` で結果をセットする",
    ],
  },
  initialCode: `const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const values = sheet.getRange("B2:B5").getValues();
// ここを完成させよう: 1000以上の行だけ合計して B6 にセット
const total = values
  .filter((row) => /* 条件を書こう */ )
  .reduce((acc, row) => acc + row[0], 0);
sheet.getRange("B6").setValue(total);
`,
  solutionCode: `const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const values = sheet.getRange("B2:B5").getValues();
const total = values
  .filter((row) => row[0] >= 1000)
  .reduce((acc, row) => acc + row[0], 0);
sheet.getRange("B6").setValue(total);
`,
});
