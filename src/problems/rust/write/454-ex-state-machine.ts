import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ex-vending-state-machine",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "総合: enum で自動販売機の状態機械",
    prompt: `## やること

1 種類の飲み物（150 円）を売る自動販売機を、**enum の状態機械** で作ろう。

\`\`\`rust
#[derive(Debug, Clone, PartialEq)]
enum State {
    Idle,                  // 待機中
    Collecting(u32),       // お金を受け取っている（合計金額）
    Sold { change: u32 },  // 販売済み。おつりと商品の受け取り待ち
}

#[derive(Debug, Clone, Copy)]
enum Event {
    Insert(u32), // お金を入れる
    Select,      // ボタンを押す
    Cancel,      // 返金
    Take,        // 商品とおつりを取る
}
\`\`\`

### \`step(state: State, event: Event) -> Result<State, String>\`

| 今の状態 | イベント | 次の状態 |
|---|---|---|
| \`Idle\` | \`Insert(n)\` | \`Collecting(n)\` |
| \`Collecting(m)\` | \`Insert(n)\` | \`Collecting(m + n)\` |
| \`Collecting(m)\` | \`Select\` | \`m >= 150\` なら \`Sold { change: m - 150 }\`、足りなければ \`Err("お金が足りません")\` |
| \`Collecting(_)\` | \`Cancel\` | \`Idle\` |
| \`Sold { .. }\` | \`Take\` | \`Idle\` |
| それ以外 | | \`Err("その操作はできません")\` |

### \`run(events: &[Event]) -> Result<State, String>\`

\`Idle\` から始めて、イベントを順に \`step\` する。途中でエラーになったら、そのエラーを返す（\`?\` を使う）。`,
    hints: [
      "`match (state, event) { (State::Idle, Event::Insert(n)) => Ok(State::Collecting(n)), ... }`",
      "ガード付きパターン: `(State::Collecting(m), Event::Select) if m >= PRICE => ...`",
      "run: `let mut s = State::Idle; for &e in events { s = step(s, e)?; } Ok(s)`",
    ],
  },
  initialCode: `const PRICE: u32 = 150;

#[derive(Debug, Clone, PartialEq)]
enum State {
    Idle,
    Collecting(u32),
    Sold { change: u32 },
}

#[derive(Debug, Clone, Copy)]
enum Event {
    Insert(u32),
    Select,
    Cancel,
    Take,
}

fn step(state: State, event: Event) -> Result<State, String> {
    todo!()
}

fn run(events: &[Event]) -> Result<State, String> {
    todo!()
}
`,
  solutionCode: `const PRICE: u32 = 150;

#[derive(Debug, Clone, PartialEq)]
enum State {
    Idle,
    Collecting(u32),
    Sold { change: u32 },
}

#[derive(Debug, Clone, Copy)]
enum Event {
    Insert(u32),
    Select,
    Cancel,
    Take,
}

fn step(state: State, event: Event) -> Result<State, String> {
    match (state, event) {
        (State::Idle, Event::Insert(n)) => Ok(State::Collecting(n)),
        (State::Collecting(m), Event::Insert(n)) => Ok(State::Collecting(m + n)),
        (State::Collecting(m), Event::Select) if m >= PRICE => {
            Ok(State::Sold { change: m - PRICE })
        }
        (State::Collecting(_), Event::Select) => Err("お金が足りません".to_string()),
        (State::Collecting(_), Event::Cancel) => Ok(State::Idle),
        (State::Sold { .. }, Event::Take) => Ok(State::Idle),
        _ => Err("その操作はできません".to_string()),
    }
}

fn run(events: &[Event]) -> Result<State, String> {
    let mut s = State::Idle;
    for &e in events {
        s = step(s, e)?;
    }
    Ok(s)
}
`,
});
