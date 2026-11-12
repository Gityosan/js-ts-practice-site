import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-types-alias-result",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "type エイリアスで Result を短く",
    prompt: `## やること

\`type\` エイリアスで長い型に名前を付け、設定ファイルの 1 行 \`key=value\` を読む関数を書こう。

\`\`\`rust
#[derive(Debug, PartialEq)]
enum ParseError {
    MissingEquals,      // = がない
    EmptyKey,           // キーが空
    BadNumber(String),  // 値が整数でない（元の文字列を持つ）
}

type ParseResult<T> = Result<T, ParseError>; // エラー型を固定した Result
type Entry = (String, i64);
\`\`\`

- \`parse_line(line: &str) -> ParseResult<Entry>\` … 最初の \`=\` で分け、前後の空白を取り除く。キーが空なら \`EmptyKey\`、値が \`i64\` に変換できなければ \`BadNumber(値の文字列)\`
- \`parse_all(lines: &[&str]) -> ParseResult<Vec<Entry>>\` … 全行を読む。**最初のエラーで止めて** そのエラーを返す

\`\`\`rust
parse_line("width = 80")   // Ok(("width", 80))
parse_line("width 80")     // Err(MissingEquals)
parse_line("x=abc")        // Err(BadNumber("abc"))
parse_all(&["a=1", "b=2"]) // Ok([("a", 1), ("b", 2)])
\`\`\`

エイリアスの宣言（\`type ParseResult<T> = ...\`）と関数のシグネチャは自分で書こう。`,
    hints: [
      "`type ParseResult<T> = Result<T, ParseError>;` と `type Entry = (String, i64);`",
      "`let (k, v) = line.split_once('=').ok_or(ParseError::MissingEquals)?;`",
      "`v.parse::<i64>().map_err(|_| ParseError::BadNumber(v.to_string()))?`。`parse_all` は `lines.iter().map(|l| parse_line(l)).collect()`（Result の Vec への collect は最初の Err で止まる）。",
    ],
  },
  initialCode: `#[derive(Debug, PartialEq)]
enum ParseError {
    MissingEquals,
    EmptyKey,
    BadNumber(String),
}

// ここに type ParseResult<T> と type Entry を書く

// ここに parse_line と parse_all を書く
fn parse_line(line: &str) -> Result<(String, i64), ParseError> {
    todo!()
}

fn parse_all(lines: &[&str]) -> Result<Vec<(String, i64)>, ParseError> {
    todo!()
}
`,
  solutionCode: `#[derive(Debug, PartialEq)]
enum ParseError {
    MissingEquals,
    EmptyKey,
    BadNumber(String),
}

type ParseResult<T> = Result<T, ParseError>;
type Entry = (String, i64);

fn parse_line(line: &str) -> ParseResult<Entry> {
    let (k, v) = line.split_once('=').ok_or(ParseError::MissingEquals)?;
    let k = k.trim();
    let v = v.trim();
    if k.is_empty() {
        return Err(ParseError::EmptyKey);
    }
    let n = v.parse::<i64>().map_err(|_| ParseError::BadNumber(v.to_string()))?;
    Ok((k.to_string(), n))
}

fn parse_all(lines: &[&str]) -> ParseResult<Vec<Entry>> {
    lines.iter().map(|l| parse_line(l)).collect()
}
`,
});
