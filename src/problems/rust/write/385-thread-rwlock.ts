import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-thread-rwlock-store",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "RwLock で読み取りの多い共有データ",
    prompt: `## やること

複数のスレッドから共有される設定ストア \`Store\` を、\`RwLock<Vec<(String, String)>>\` を使って実装しよう。メソッドはすべて \`&self\` を取る（内部可変性）。

| メソッド | 動き |
|---|---|
| \`Store::new()\` | 空のストア |
| \`set(&self, key: &str, value: &str)\` | 書き込みロックを取り、同じキーがあれば値を上書き、なければ末尾に追加 |
| \`get(&self, key: &str) -> Option<String>\` | 読み取りロックを取り、値のコピーを返す |
| \`len(&self) -> usize\` | 読み取りロックで件数を返す |

\`Store\` は \`Sync\` なので、\`thread::scope\` の中で複数スレッドから \`&store\` を使える（採点でもそうする）。

\`\`\`rust
let w = self.data.write().unwrap(); // 書き込み（排他）
let r = self.data.read().unwrap();  // 読み取り（共有）
\`\`\``,
    hints: [
      "`let mut w = self.data.write().unwrap(); if let Some(e) = w.iter_mut().find(|(k, _)| k == key) { e.1 = value.to_string(); } else { w.push(...) }`",
      "`self.data.read().unwrap().iter().find(|(k, _)| k == key).map(|(_, v)| v.clone())`",
      "`len` は `self.data.read().unwrap().len()`",
    ],
  },
  initialCode: `use std::sync::RwLock;

struct Store {
    data: RwLock<Vec<(String, String)>>,
}

impl Store {
    fn new() -> Self {
        Store { data: RwLock::new(Vec::new()) }
    }

    fn set(&self, key: &str, value: &str) {
        todo!()
    }

    fn get(&self, key: &str) -> Option<String> {
        todo!()
    }

    fn len(&self) -> usize {
        todo!()
    }
}
`,
  solutionCode: `use std::sync::RwLock;

struct Store {
    data: RwLock<Vec<(String, String)>>,
}

impl Store {
    fn new() -> Self {
        Store { data: RwLock::new(Vec::new()) }
    }

    fn set(&self, key: &str, value: &str) {
        let mut w = self.data.write().unwrap();
        if let Some(entry) = w.iter_mut().find(|(k, _)| k == key) {
            entry.1 = value.to_string();
        } else {
            w.push((key.to_string(), value.to_string()));
        }
    }

    fn get(&self, key: &str) -> Option<String> {
        let r = self.data.read().unwrap();
        r.iter().find(|(k, _)| k == key).map(|(_, v)| v.clone())
    }

    fn len(&self) -> usize {
        self.data.read().unwrap().len()
    }
}
`,
});
