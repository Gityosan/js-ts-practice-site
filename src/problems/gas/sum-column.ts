import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "fill-gas-sum-column",
  stage: "fill",
  scenario: "gas",
  copy: {
    title: "B列を合計して B6 にセットしよう",
    prompt: `## やること

Google Apps Script（GAS）でスプレッドシートの **B2〜B5 の値を合計**し、**B6 にセット**するコードを書こう。

スプレッドシートのデータ（モック）:
| | B |
|---|---|
| 2 | 1200 |
| 3 | 800 |
| 4 | 500 |
| 5 | 2000 |
| **6** | **← ここに合計を入れる** |

\`\`\`ts
// 書くコード（イメージ）
const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const values = sheet.getRange("B2:B5").getValues();
// values は [[1200], [800], [500], [2000]] の形
const total = values.reduce((acc, row) => acc + row[0], 0);
sheet.getRange("B6").setValue(total);
\`\`\`

## getValues() の形

\`getRange("B2:B5").getValues()\` は**2次元配列**を返す:
\`[[1200], [800], [500], [2000]]\` — 各行が配列になっている。
合計するには \`row[0]\`（行の 0 番目の値）を使う。`,
    hints: [
      '`sheet.getRange("B2:B5").getValues()` で [[1200], [800], ...] が取れる',
      "`values.reduce((acc, row) => acc + row[0], 0)` で全行の B 列を合計できる",
      '`sheet.getRange("B6").setValue(total)` で合計値をセットする',
    ],
  },
  initialCode: `// SpreadsheetApp はモックで用意されています
const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const values = sheet.getRange("B2:B5").getValues();
// ここに書こう: values を合計して B6 にセットする

`,
  solutionCode: `const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const values = sheet.getRange("B2:B5").getValues();
const total = values.reduce((acc: number, row: number[]) => acc + row[0], 0);
sheet.getRange("B6").setValue(total);
`,
});
