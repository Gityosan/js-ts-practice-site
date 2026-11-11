import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-closure-fnonce",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "1 回だけ呼べるクロージャ（FnOnce）",
    prompt: `## やること

### 1. FnOnce を受け取る

\`run_with_log<F: FnOnce() -> String>(f: F) -> String\` … f を 1 回呼び、結果の前に \`"result: "\` を付けて返す。

### 2. FnOnce になるクロージャを返す

\`make_taker(s: String) -> impl FnOnce() -> String\` … 呼ぶと s を **そのまま返す**（所有権を手放す）クロージャを返す。中の値を手放すので 2 回は呼べない → **FnOnce**。

### 3. Option を 1 回だけ使う

\`or_compute(x: Option<String>, f: impl FnOnce() -> String) -> String\` … x が Some ならその中身、None なら f を呼んだ結果を返す（f は必要なときだけ呼ぶ）。

\`\`\`rust
run_with_log(|| "ok".to_string())           // "result: ok"
run_with_log(make_taker("hi".to_string()))  // "result: hi"
or_compute(None, || "default".to_string())  // "default"
\`\`\`

- FnOnce は一番ゆるい条件。Fn や FnMut なクロージャも渡せる
- 1 回しか呼ばない関数の引数は FnOnce にしておくと、何でも受け取れて便利`,
    hints: [
      'run_with_log は `format!("result: {}", f())`',
      "make_taker は `move || s`",
      "or_compute は `match x { Some(v) => v, None => f() }`（`x.unwrap_or_else(f)` でも同じ）",
    ],
  },
  initialCode: `fn run_with_log<F: FnOnce() -> String>(f: F) -> String {
    todo!()
}

fn make_taker(s: String) -> impl FnOnce() -> String {
    move || todo!()
}

fn or_compute(x: Option<String>, f: impl FnOnce() -> String) -> String {
    todo!()
}
`,
  solutionCode: `fn run_with_log<F: FnOnce() -> String>(f: F) -> String {
    format!("result: {}", f())
}

fn make_taker(s: String) -> impl FnOnce() -> String {
    move || s
}

fn or_compute(x: Option<String>, f: impl FnOnce() -> String) -> String {
    match x {
        Some(v) => v,
        None => f(),
    }
}
`,
});
