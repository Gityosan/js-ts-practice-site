import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-learn-option-result-combinators",
  stage: "learn",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "Option / Result のコンビネータ",
    prompt: `## match を書かずに Option / Result を扱う

\`Option\` や \`Result\` は \`match\` で中身を取り出せるが、毎回書くと長くなる。

\`\`\`rust
let len = match name {
    Some(s) => s.len(),
    None => 0,
};
\`\`\`

**コンビネータ（combinator）** は、こうした定番の処理をメソッドにしたもの。上は 1 行になる。

\`\`\`rust
let len = name.map(|s| s.len()).unwrap_or(0);
\`\`\`

JS の \`name?.length ?? 0\` に近い。メソッドをつなげて「値があれば変換、なければ既定値」を流れるように書ける。

## Option の主なコンビネータ

| メソッド | Some(x) のとき | None のとき | 戻り値 |
|---|---|---|---|
| \`map(f)\` | \`Some(f(x))\` | \`None\` | \`Option<U>\` |
| \`and_then(f)\` | \`f(x)\`（f が Option を返す） | \`None\` | \`Option<U>\` |
| \`filter(p)\` | p(&x) が真なら \`Some(x)\`、偽なら \`None\` | \`None\` | \`Option<T>\` |
| \`unwrap_or(v)\` | \`x\` | \`v\` | \`T\` |
| \`unwrap_or_else(f)\` | \`x\` | \`f()\` | \`T\` |
| \`unwrap_or_default()\` | \`x\` | \`T::default()\`（0、空文字列…） | \`T\` |
| \`ok_or(e)\` | \`Ok(x)\` | \`Err(e)\` | \`Result<T, E>\` |
| \`ok_or_else(f)\` | \`Ok(x)\` | \`Err(f())\` | \`Result<T, E>\` |
| \`or(other)\` | \`Some(x)\` | \`other\` | \`Option<T>\` |
| \`zip(other)\` | other も Some(y) なら \`Some((x, y))\` | \`None\` | \`Option<(T, U)>\` |
| \`map_or(v, f)\` | \`f(x)\` | \`v\` | \`U\` |
| \`is_some_and(p)\` | \`p(x)\` | \`false\` | \`bool\` |

### map と and_then の違い

- \`map\` は「中身を **普通の値に** 変換する」。f が \`Option\` を返すと \`Option<Option<T>>\` になってしまう
- \`and_then\` は「中身を **Option を返す処理** につなぐ」。失敗しうる処理を連鎖させるときに使う（他言語の flatMap）

\`\`\`rust
let s: Option<&str> = Some("42");
let a: Option<Option<i32>> = s.map(|t| t.parse().ok());  // 入れ子になる
let b: Option<i32> = s.and_then(|t| t.parse().ok());     // Some(42)
\`\`\`

### 例: 設定値を段階的に取り出す

\`\`\`rust
fn lookup<'a>(cfg: &[(&str, &'a str)], key: &str) -> Option<&'a str> {
    cfg.iter().find(|(k, _)| *k == key).map(|(_, v)| *v)
}

let cfg = [("port", "3000"), ("debug", "yes")];

let port: u16 = lookup(&cfg, "port")       // Option<&str>
    .and_then(|s| s.parse().ok())          // Option<u16>（数として読めなければ None）
    .filter(|&p| p >= 1024)                // 1024 未満は None に
    .unwrap_or(8080);                      // どこかで None なら既定値
\`\`\`

途中のどこで \`None\` になっても、以降の処理は飛ばされて最後の \`unwrap_or\` に行く。

### unwrap_or と unwrap_or_else の使い分け

\`unwrap_or(v)\` の \`v\` は **常に先に計算される**。重い処理や副作用がある既定値は \`unwrap_or_else(|| ...)\` にすると、None のときだけ計算される。

\`\`\`rust
let name = maybe_name.unwrap_or(String::from("guest"));          // 毎回 String を作る
let name = maybe_name.unwrap_or_else(|| String::from("guest"));  // None のときだけ作る
let name = maybe_name.unwrap_or_default();                        // 空文字列 ""
\`\`\`

### as_ref / as_deref

\`Option<String>\` の中身を **借りて** 処理したいとき、そのまま \`map\` すると所有権が移ってしまう。\`as_ref()\` で \`Option<&String>\`、\`as_deref()\` で \`Option<&str>\` に変えてから使う。

\`\`\`rust
let name: Option<String> = Some("Ferris".into());
let len = name.as_ref().map(|s| s.len());          // name はまだ使える
let s: &str = name.as_deref().unwrap_or("guest");
\`\`\`

## Result の主なコンビネータ

| メソッド | Ok(x) のとき | Err(e) のとき | 戻り値 |
|---|---|---|---|
| \`map(f)\` | \`Ok(f(x))\` | \`Err(e)\` | \`Result<U, E>\` |
| \`map_err(f)\` | \`Ok(x)\` | \`Err(f(e))\` | \`Result<T, F>\` |
| \`and_then(f)\` | \`f(x)\`（f が Result を返す） | \`Err(e)\` | \`Result<U, E>\` |
| \`ok()\` | \`Some(x)\` | \`None\`（エラーは捨てる） | \`Option<T>\` |
| \`unwrap_or(v)\` | \`x\` | \`v\` | \`T\` |
| \`unwrap_or_else(f)\` | \`x\` | \`f(e)\`（エラーを受け取れる） | \`T\` |
| \`unwrap_or_default()\` | \`x\` | \`T::default()\` | \`T\` |
| \`is_ok()\` / \`is_err()\` | 判定 | 判定 | \`bool\` |

\`\`\`rust
let n: Result<i32, String> = "12".parse::<i32>()
    .map_err(|e| format!("parse error: {}", e))   // エラーの型を String に揃える
    .and_then(|n| if n > 0 { Ok(n) } else { Err("not positive".to_string()) })
    .map(|n| n * 2);                               // Ok(24)
\`\`\`

### Option ⇔ Result の変換

| 変換 | メソッド |
|---|---|
| Option → Result | \`opt.ok_or(err)\` / \`opt.ok_or_else(f)\`（f はエラーを作るクロージャ） |
| Result → Option | \`res.ok()\`（エラーを捨てる） / \`res.err()\`（エラーだけ取る） |


## ? 演算子との使い分け

\`?\` は「Err / None なら **その場で関数から return**、Ok / Some なら中身を取り出す」。

\`\`\`rust
fn port_of(cfg: &[(&str, &str)]) -> Result<u16, String> {
    let s = lookup(cfg, "port").ok_or("port がない")?;           // Option → Result にしてから ?
    let p = s.parse::<u16>().map_err(|_| "port が数でない")?;    // エラーの型を揃えてから ?
    Ok(p)
}
\`\`\`

| 状況 | おすすめ |
|---|---|
| 失敗したら呼び出し元にエラーを返したい | \`?\`（関数の戻り値が Result / Option のとき） |
| 失敗したら既定値で続けたい | \`unwrap_or\` / \`unwrap_or_else\` / \`unwrap_or_default\` |
| 値を変換したい（失敗は素通し） | \`map\` / \`map_err\` |
| 失敗しうる処理を続けてつなぎたい | \`and_then\`（または \`?\` を複数行で） |
| 型を Option ⇔ Result で合わせたい | \`ok_or\` / \`ok\` |
| 絶対に失敗しない・テストで手早く | \`unwrap\` / \`expect("理由")\`（失敗すると panic） |

- \`?\` は戻り値が Result（または Option）の関数の中でしか使えない
- Result の関数の中で Option に \`?\` は使えない（逆も）。\`ok_or\` / \`ok\` で揃える
- \`?\` はエラーを \`From\` で自動変換する。\`&str\` → \`String\` は自動でできる

## iter と collect で Vec<Result> → Result<Vec>

文字列のリストを全部数に変換したい。\`map(parse)\` の結果は \`Result\` のイテレータになる。
これを **\`Result<Vec<_>, _>\` に collect** すると、

- 全部 Ok なら \`Ok(Vec)\`
- 1 つでも Err があれば **最初の Err**（そこで処理は止まる）

になる。

\`\`\`rust
let good: Result<Vec<i32>, _> = ["1", "2", "3"].iter().map(|s| s.parse::<i32>()).collect();
// Ok([1, 2, 3])

let bad: Result<Vec<i32>, _> = ["1", "x", "3"].iter().map(|s| s.parse::<i32>()).collect();
// Err(ParseIntError { kind: InvalidDigit })
\`\`\`

Option も同じ: \`Option<Vec<_>>\` に collect すると、1 つでも None があれば None。

\`\`\`rust
let all: Option<Vec<i32>> = vec![Some(1), Some(2)].into_iter().collect(); // Some([1, 2])
let none: Option<Vec<i32>> = vec![Some(1), None].into_iter().collect();   // None
\`\`\`

\`sum\` も同じように \`Result<i32, _>\` に集められる: \`iter.map(parse).sum::<Result<i32, _>>()\`。

失敗したものを **捨てて** 成功したものだけ欲しいなら \`filter_map(|s| s.parse().ok())\`。
成功と失敗を **両方** 集めたいなら \`partition(|r| r.is_ok())\` で 2 つに分けられる。

## まとめ

- 変換は \`map\`、失敗しうる処理の連鎖は \`and_then\`、条件で None にするのは \`filter\`
- 既定値は \`unwrap_or\` / \`unwrap_or_else\` / \`unwrap_or_default\`
- Option ⇔ Result は \`ok_or\` / \`ok\`、エラー型を変えるのは \`map_err\`
- 呼び出し元に失敗を返すなら \`?\`
- \`collect::<Result<Vec<_>, _>>()\` で「全部成功なら Ok(Vec)」`,
    hints: [
      "map は中身を変換、and_then は Option / Result を返す処理につなぐ。",
      "unwrap_or_else / unwrap_or_default で既定値。重い既定値はクロージャで遅延させる。",
      "ok_or で Option → Result、ok で Result → Option、map_err でエラーの型を変える。",
      "Result のイテレータを `Result<Vec<_>, _>` に collect すると、1 つでも Err なら Err。",
    ],
  },
  learn: {
    quiz: [
      {
        prompt: '`Some("5").map(|s| s.parse::<i32>().ok())` の型は？',
        choices: ["Option<Option<i32>>", "Option<i32>", "Result<i32, _>", "i32"],
        answer: "Option<Option<i32>>",
        explain:
          "map は f の戻り値をそのまま Some で包むので入れ子になる。and_then を使えば Option<i32> になる。",
      },
      {
        prompt: "`None::<i32>.map(|x| x * 2).unwrap_or(7)` の値は？",
        choices: ["7", "14", "0", "panic する"],
        answer: "7",
        explain: "None に map しても None のまま。最後の unwrap_or で 7 になる。",
      },
      {
        prompt: "`Some(3).filter(|x| x % 2 == 0)` の値は？",
        choices: ["None", "Some(3)", "Some(false)", "false"],
        answer: "None",
        explain: "filter は条件が偽なら None にする。",
      },
      {
        prompt: "Option を Result に変換するメソッドは？",
        choices: ["ok_or", "ok", "map_err", "unwrap_or"],
        answer: "ok_or",
        explain: "Some(x) → Ok(x)、None → Err(e)。Result → Option は ok()。",
      },
      {
        prompt: "次の結果は？",
        snippet: `let v: Result<Vec<i32>, _> = ["1", "x", "3"]
    .iter()
    .map(|s| s.parse::<i32>())
    .collect();
`,
        choices: [
          "Err(ParseIntError { kind: InvalidDigit })",
          "Ok([1, 3])",
          "Ok([1, 0, 3])",
          "[Ok(1), Err(...), Ok(3)]",
        ],
        answer: "Err(ParseIntError { kind: InvalidDigit })",
        explain: "Result<Vec<_>, _> に collect すると、1 つでも Err があれば最初の Err になる。",
      },
      {
        prompt: "`unwrap_or(expensive())` より `unwrap_or_else(|| expensive())` がよい理由は？",
        choices: [
          "None / Err のときだけ expensive() が呼ばれるから",
          "結果の型が変わるから",
          "panic しなくなるから",
          "Some のときに expensive() を呼べるから",
        ],
        answer: "None / Err のときだけ expensive() が呼ばれるから",
        explain:
          "unwrap_or の引数は常に先に評価される。クロージャにすれば必要なときだけ評価される（遅延評価）。",
      },
      {
        prompt:
          "戻り値が `Result<u16, String>` の関数の中で、`Option<&str>` の値に `?` を使うには？",
        choices: [
          'opt.ok_or("なし")? のように Result に変換してから ? を付ける',
          "そのまま opt? と書ける",
          "opt.ok()? と書く",
          "unwrap してから ? を付ける",
        ],
        answer: 'opt.ok_or("なし")? のように Result に変換してから ? を付ける',
        explain: "Result を返す関数で Option に ? は使えない。ok_or で Result に揃える。",
      },
      {
        prompt: "`Some(2).zip(None::<i32>)` の値は？",
        choices: ["None", "Some((2, 0))", "Some(2)", "Some((2, None))"],
        answer: "None",
        explain: "zip は両方 Some のときだけ Some((x, y))。片方でも None なら None。",
      },
    ],
  },
});
