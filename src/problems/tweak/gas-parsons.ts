import { defineProblem } from "../../core/schemas";

export default defineProblem({
  id: "tweak-gas-parsons",
  stage: "tweak",
  scenario: "gas",
  copy: {
    title: "GAS の行を正しい順に並べよう",
    prompt: `## やること

**ドラッグして正しい順番**に並べ替え、A列の合計を B1 にセットする GAS コードを完成させよう。

スプレッドシートのデータ（モック）:
| | A |
|---|---|
| 2 | 100 |
| 3 | 200 |
| 4 | 300 |

\`B1\` に \`600\` が入れば正解！

## GAS の API の流れ

\`\`\`
SpreadsheetApp               ← グローバル
  .getActiveSpreadsheet()    ← スプレッドシートを取得
    .getActiveSheet()        ← シートを取得
      .getRange("A2:A4")     ← 範囲を取得
        .getValues()         ← 2次元配列を取得
\`\`\`

取れた配列は \`[[100], [200], [300]]\` の形。
\`reduce\` で合計して \`setValue\` にセット。`,
    hints: [
      "最初は SpreadsheetApp から始まる — まず全体のオブジェクトを取得",
      "`const ss = ...` → `const sheet = ...` → `const range = ...` の順で絞っていく",
      "`getValues()` してから `reduce` で合計、最後に `setValue`",
    ],
  },
  tweak: {
    kind: "parsons",
    lines: [
      "const ss = SpreadsheetApp.getActiveSpreadsheet();",
      "const sheet = ss.getActiveSheet();",
      "const range = sheet.getRange(\"A2:A4\");",
      "const values = range.getValues();",
      "const total = values.reduce((s, r) => s + r[0], 0);",
      "sheet.getRange(\"B1\").setValue(total);",
    ],
  },
  initialCode: `const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet = ss.getActiveSheet();
const range = sheet.getRange("A2:A4");
const values = range.getValues();
const total = values.reduce((s, r) => s + r[0], 0);
sheet.getRange("B1").setValue(total);`,
  solutionCode: `const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet = ss.getActiveSheet();
const range = sheet.getRange("A2:A4");
const values = range.getValues();
const total = values.reduce((s, r) => s + r[0], 0);
sheet.getRange("B1").setValue(total);`,
});
