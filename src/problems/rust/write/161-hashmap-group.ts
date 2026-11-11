import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-hashmap-entry-group",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "HashMap と entry でグループ分け・在庫管理",
    prompt: `## やること

- \`group_by_len(words: &[&str]) -> Vec<(usize, Vec<String>)>\` … 単語を **文字数ごと** にまとめる。\`HashMap<usize, Vec<String>>\` に \`entry(len).or_default().push(..)\` で集め、最後に **文字数の昇順** に並べた Vec で返す（各グループ内は出てきた順）
- \`Inventory\` 構造体（中身は \`HashMap<String, u32>\`）に次を実装
  - \`add(&mut self, item: &str, n: u32)\` … 在庫を n 増やす（なければ新規）
  - \`take(&mut self, item: &str, n: u32) -> bool\` … 在庫が n 以上あれば減らして true、足りない・存在しないなら何もせず false。0 になった品目は削除
  - \`count(&self, item: &str) -> u32\` … 在庫数（なければ 0）
  - \`items(&self) -> Vec<(String, u32)>\` … 名前順にソートした一覧

\`\`\`rust
group_by_len(&["hi", "cat", "yo", "dog", "a"]);
// [(1, ["a"]), (2, ["hi", "yo"]), (3, ["cat", "dog"])]
\`\`\`

HashMap は順序不定なので、外に返すときは **ソートした Vec** にする。`,
    hints: [
      "`let mut map: HashMap<usize, Vec<String>> = HashMap::new(); map.entry(w.len()).or_default().push(w.to_string());`",
      "`let mut v: Vec<_> = map.into_iter().collect(); v.sort();`",
      "take: `match self.stock.get_mut(item) { Some(c) if *c >= n => { *c -= n; ... } _ => false }`",
      "count: `self.stock.get(item).copied().unwrap_or(0)`",
    ],
  },
  initialCode: `use std::collections::HashMap;

fn group_by_len(words: &[&str]) -> Vec<(usize, Vec<String>)> {
    todo!()
}

struct Inventory {
    stock: HashMap<String, u32>,
}

impl Inventory {
    fn new() -> Self {
        Inventory { stock: HashMap::new() }
    }

    fn add(&mut self, item: &str, n: u32) {
        todo!()
    }

    fn take(&mut self, item: &str, n: u32) -> bool {
        todo!()
    }

    fn count(&self, item: &str) -> u32 {
        todo!()
    }

    fn items(&self) -> Vec<(String, u32)> {
        todo!()
    }
}
`,
  solutionCode: `use std::collections::HashMap;

fn group_by_len(words: &[&str]) -> Vec<(usize, Vec<String>)> {
    let mut map: HashMap<usize, Vec<String>> = HashMap::new();
    for w in words {
        map.entry(w.len()).or_default().push(w.to_string());
    }
    let mut v: Vec<(usize, Vec<String>)> = map.into_iter().collect();
    v.sort_by_key(|(len, _)| *len);
    v
}

struct Inventory {
    stock: HashMap<String, u32>,
}

impl Inventory {
    fn new() -> Self {
        Inventory { stock: HashMap::new() }
    }

    fn add(&mut self, item: &str, n: u32) {
        *self.stock.entry(item.to_string()).or_insert(0) += n;
    }

    fn take(&mut self, item: &str, n: u32) -> bool {
        match self.stock.get_mut(item) {
            Some(c) if *c >= n => {
                *c -= n;
                if *c == 0 {
                    self.stock.remove(item);
                }
                true
            }
            _ => false,
        }
    }

    fn count(&self, item: &str) -> u32 {
        self.stock.get(item).copied().unwrap_or(0)
    }

    fn items(&self) -> Vec<(String, u32)> {
        let mut v: Vec<(String, u32)> = self.stock.iter().map(|(k, v)| (k.clone(), *v)).collect();
        v.sort();
        v
    }
}
`,
});
