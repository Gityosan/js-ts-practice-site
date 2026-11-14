import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-decode-result-question",
  stage: "decode",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Result と ?：エラーを伝える骨格",
    prompt: `## 失敗するかもしれない関数

\`\`\`rust
fn double(s: &str) -> Result<i32, String> {
    let n: i32 = s.parse().map_err(|_| String::from("数字じゃない"))?;
    Ok(n * 2)
}
\`\`\`

- \`Result<i32, String>\` … 成功なら \`Ok(i32)\`、失敗なら \`Err(String)\` を返す、という戻り値の型
- \`s.parse()\` … 文字列を数値に変換（失敗するかもしれないので Result が返る）
- \`.map_err(|_| ...)\` … エラーの中身を別の値に変える。\`|_|\` は **クロージャ（無名関数）** の引数
- 末尾の \`?\` … Err ならその場で関数から返す。Ok なら中身を取り出して続ける
- \`String::from\` の \`::\` は「型 String の関連関数 from」というパス区切り
- \`Ok(n * 2)\` … 成功の値を包んで返す（最後の式なので \`;\` なし）`,
    hints: [
      "`?` は「失敗ならここで return」の短縮形。",
      "`|_|` の `|` はクロージャの引数を囲む記号。",
      "`Ok` / `Err` は Result の 2 つの候補。",
    ],
  },
  decode: {
    code: `fn double(s: &str) -> Result<i32, String> {
    let n: i32 = s.parse().map_err(|_| String::from("数字じゃない"))?;
    Ok(n * 2)
}`,
    quiz: [
      {
        prompt: "`Result<i32, String>` は何を表す？",
        choices: [
          "成功なら i32、失敗なら String を返す",
          "i32 と String の両方を返す",
          "i32 を String に変換する",
        ],
        answer: "成功なら i32、失敗なら String を返す",
        explain: "Result は `Ok(成功の値)` か `Err(エラーの値)` のどちらか。",
      },
      {
        prompt: "行末の `?` は何をする？",
        choices: [
          "Err ならその場で関数から返し、Ok なら中身を取り出す",
          "値が null かどうか調べる",
          "三項演算子の一部",
        ],
        answer: "Err ならその場で関数から返し、Ok なら中身を取り出す",
        explain: "`?` はエラーを呼び出し元に伝える短縮記法。",
      },
      {
        prompt: "`|_|` は何？",
        snippet: `map_err(|_| String::from("数字じゃない"))`,
        choices: ["クロージャ（無名関数）の引数", "ビット OR", "絶対値"],
        answer: "クロージャ（無名関数）の引数",
        explain: "`|引数| 本体` がクロージャ。`_` は「引数を受け取るが使わない」。",
      },
      {
        prompt: "`String::from` の `::` は何？",
        choices: ["型 String に属する関数 from を指すパス区切り", "型注釈", "範囲"],
        answer: "型 String に属する関数 from を指すパス区切り",
        explain: "`型::関連関数` の形。`String::new()` なども同じ。",
      },
      {
        prompt: "最後の `Ok(n * 2)` に `;` が無いのはなぜ？",
        choices: ["最後の式として戻り値にするため", "Ok は文ではないから付けられない", "書き忘れ"],
        answer: "最後の式として戻り値にするため",
        explain: "関数の最後の式（; なし）が戻り値。`Ok(...)` で成功の値を包んで返している。",
      },
    ],
  },
});
