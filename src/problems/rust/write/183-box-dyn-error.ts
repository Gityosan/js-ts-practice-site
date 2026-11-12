import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-box-dyn-error-config",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Box<dyn Error> で異なるエラーをまとめる",
    prompt: `## やること

\`"キー=値"\` が 1 行に 1 つ並んだ設定テキストを読む。値はすべて整数。

\`\`\`text
width=80
height = 24
\`\`\`

- \`parse_config(text: &str) -> Result<BTreeMap<String, i64>, Box<dyn Error>>\`
  - 空行（空白だけの行も）は飛ばす
  - \`=\` がない行は \`Err\`（メッセージ \`"3 行目: '=' がありません"\`、行番号は 1 始まり）。文字列から Box<dyn Error> を作るには \`format!(..).into()\`
  - キーと値は \`trim()\` する。値の \`parse::<i64>()?\` が失敗したら、その \`ParseIntError\` を **そのまま \`?\` で** 返してよい（Box<dyn Error> に自動変換される）
- \`get_area(text: &str) -> Result<i64, Box<dyn Error>>\` … \`parse_config(text)?\` から width と height を取り出して掛ける。ない場合は \`"width がありません"\` のようなエラー（\`ok_or_else\` で）

採点ではエラーを \`.map_err(|e| e.to_string())\` で文字列にして比べる。

\`\`\`rust
get_area("width=80\\nheight=24");   // Ok(1920)
\`\`\``,
    hints: [
      "`for (i, line) in text.lines().enumerate() { if line.trim().is_empty() { continue; } ... }`",
      "`let (k, v) = line.split_once('=').ok_or_else(|| format!(\"{} 行目: '=' がありません\", i + 1))?;`（String は ? で Box<dyn Error> に変換される）",
      "`map.insert(k.trim().to_string(), v.trim().parse::<i64>()?);`",
      'get_area: `let w = *cfg.get("width").ok_or_else(|| "width がありません".to_string())?;`',
    ],
  },
  initialCode: `use std::collections::BTreeMap;
use std::error::Error;

fn parse_config(text: &str) -> Result<BTreeMap<String, i64>, Box<dyn Error>> {
    todo!()
}

fn get_area(text: &str) -> Result<i64, Box<dyn Error>> {
    todo!()
}
`,
  solutionCode: `use std::collections::BTreeMap;
use std::error::Error;

fn parse_config(text: &str) -> Result<BTreeMap<String, i64>, Box<dyn Error>> {
    let mut map = BTreeMap::new();
    for (i, line) in text.lines().enumerate() {
        if line.trim().is_empty() {
            continue;
        }
        let (k, v) = line
            .split_once('=')
            .ok_or_else(|| format!("{} 行目: '=' がありません", i + 1))?;
        map.insert(k.trim().to_string(), v.trim().parse::<i64>()?);
    }
    Ok(map)
}

fn get_area(text: &str) -> Result<i64, Box<dyn Error>> {
    let cfg = parse_config(text)?;
    let w = *cfg.get("width").ok_or_else(|| "width がありません".to_string())?;
    let h = *cfg.get("height").ok_or_else(|| "height がありません".to_string())?;
    Ok(w * h)
}
`,
});
