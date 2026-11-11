import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-static-atomic-id",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "static とアトミック型で連番 ID を発行する",
    prompt: `## やること

### 1. 連番 ID

\`static NEXT_ID: AtomicU32\` を使って、呼ぶたびに新しい ID（1, 2, 3, ...）を返す \`next_id() -> u32\` を書こう。\`static mut\` と \`unsafe\` は使わないこと。

- \`fetch_add(1, Ordering::SeqCst)\` は **足す前の値** を返す
- 初期値を 1 にしておけば、最初の呼び出しで 1 が返る

### 2. \`'static\` な文字列を返す

\`weekday_name(n: u32) -> &'static str\` … \`0\` → \`"日"\`, \`1\` → \`"月"\`, ..., \`6\` → \`"土"\`、それ以外 → \`"?"\`。曜日名は \`static WEEKDAYS: [&str; 7]\` に入れておき、そこから取り出す。

文字列リテラルや \`static\` の中身は \`'static\` なので、関数の外に返しても大丈夫。

### 3. \`Mutex\` を static に置く

\`static HISTORY: Mutex<Vec<String>>\` に記録を追加する \`record(msg: &str) -> usize\`（追加後の件数を返す）を書こう。\`Mutex::new\` と \`Vec::new\` は \`const fn\` なので \`static\` の初期化に使える。`,
    hints: [
      "`static NEXT_ID: AtomicU32 = AtomicU32::new(1);` と `NEXT_ID.fetch_add(1, Ordering::SeqCst)`",
      '`WEEKDAYS.get(n as usize).copied().unwrap_or("?")`',
      "`let mut h = HISTORY.lock().unwrap(); h.push(msg.to_string()); h.len()`",
    ],
  },
  initialCode: `use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::Mutex;

static NEXT_ID: AtomicU32 = AtomicU32::new(1);
static WEEKDAYS: [&str; 7] = ["日", "月", "火", "水", "木", "金", "土"];
static HISTORY: Mutex<Vec<String>> = Mutex::new(Vec::new());

fn next_id() -> u32 {
    todo!()
}

fn weekday_name(n: u32) -> &'static str {
    todo!()
}

fn record(msg: &str) -> usize {
    todo!()
}
`,
  solutionCode: `use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::Mutex;

static NEXT_ID: AtomicU32 = AtomicU32::new(1);
static WEEKDAYS: [&str; 7] = ["日", "月", "火", "水", "木", "金", "土"];
static HISTORY: Mutex<Vec<String>> = Mutex::new(Vec::new());

fn next_id() -> u32 {
    NEXT_ID.fetch_add(1, Ordering::SeqCst)
}

fn weekday_name(n: u32) -> &'static str {
    WEEKDAYS.get(n as usize).copied().unwrap_or("?")
}

fn record(msg: &str) -> usize {
    let mut h = HISTORY.lock().unwrap();
    h.push(msg.to_string());
    h.len()
}
`,
});
