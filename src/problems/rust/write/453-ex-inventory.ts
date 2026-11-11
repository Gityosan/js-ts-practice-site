import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ex-inventory-result",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "総合: 在庫管理（構造体 + HashMap + Result）",
    prompt: `## やること

商品の在庫を管理する \`Inventory\` を実装しよう。エラーは enum \`InvError\` で表す。

\`\`\`rust
#[derive(Debug, PartialEq)]
enum InvError {
    NotFound(String),
    OutOfStock { name: String, requested: u32, available: u32 },
}
\`\`\`

| メソッド | 動き |
|---|---|
| \`new() -> Inventory\` | 空の在庫 |
| \`add(&mut self, name: &str, qty: u32)\` | 入荷。既にあれば数を足す |
| \`remove(&mut self, name: &str, qty: u32) -> Result<u32, InvError>\` | 出荷。成功したら **残りの数** を返す。残りが 0 になったら商品ごと削除する |
| \`quantity(&self, name: &str) -> u32\` | 在庫数（無ければ 0） |
| \`report(&self) -> Vec<String>\` | \`"名前: 数"\` の一覧を **名前順** で |

\`remove\` のエラー:

- 商品が無い → \`Err(InvError::NotFound(名前))\`
- 在庫が足りない → \`Err(InvError::OutOfStock { name, requested, available })\`（在庫は減らさない）`,
    hints: [
      "`*self.stock.entry(name.to_string()).or_insert(0) += qty;`",
      "`let available = *self.stock.get(name).ok_or(InvError::NotFound(name.to_string()))?;`",
      'report: `let mut v: Vec<String> = self.stock.iter().map(|(k, v)| format!("{k}: {v}")).collect(); v.sort(); v`',
    ],
  },
  initialCode: `use std::collections::HashMap;

#[derive(Debug, PartialEq)]
enum InvError {
    NotFound(String),
    OutOfStock { name: String, requested: u32, available: u32 },
}

struct Inventory {
    stock: HashMap<String, u32>,
}

impl Inventory {
    fn new() -> Self {
        todo!()
    }

    fn add(&mut self, name: &str, qty: u32) {
        todo!()
    }

    fn remove(&mut self, name: &str, qty: u32) -> Result<u32, InvError> {
        todo!()
    }

    fn quantity(&self, name: &str) -> u32 {
        todo!()
    }

    fn report(&self) -> Vec<String> {
        todo!()
    }
}
`,
  solutionCode: `use std::collections::HashMap;

#[derive(Debug, PartialEq)]
enum InvError {
    NotFound(String),
    OutOfStock { name: String, requested: u32, available: u32 },
}

struct Inventory {
    stock: HashMap<String, u32>,
}

impl Inventory {
    fn new() -> Self {
        Inventory { stock: HashMap::new() }
    }

    fn add(&mut self, name: &str, qty: u32) {
        *self.stock.entry(name.to_string()).or_insert(0) += qty;
    }

    fn remove(&mut self, name: &str, qty: u32) -> Result<u32, InvError> {
        let available = *self
            .stock
            .get(name)
            .ok_or(InvError::NotFound(name.to_string()))?;
        if qty > available {
            return Err(InvError::OutOfStock {
                name: name.to_string(),
                requested: qty,
                available,
            });
        }
        let rest = available - qty;
        if rest == 0 {
            self.stock.remove(name);
        } else {
            self.stock.insert(name.to_string(), rest);
        }
        Ok(rest)
    }

    fn quantity(&self, name: &str) -> u32 {
        self.stock.get(name).copied().unwrap_or(0)
    }

    fn report(&self) -> Vec<String> {
        let mut v: Vec<String> = self.stock.iter().map(|(k, n)| format!("{k}: {n}")).collect();
        v.sort();
        v
    }
}
`,
});
