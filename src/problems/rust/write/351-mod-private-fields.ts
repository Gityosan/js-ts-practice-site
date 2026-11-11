import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-mod-private-fields",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "非公開フィールドを持つ構造体",
    prompt: `## やること

\`bank\` モジュールの \`Account\` は、**残高（balance）を外から直接書き換えられない** ようにしたい。フィールドを非公開にし、公開メソッドからだけ操作させよう。

\`\`\`rust
mod bank {
    pub struct Account {
        pub owner: String,   // 公開: 誰でも読める
        balance: i64,        // 非公開: メソッド経由でだけ変わる
    }
}
\`\`\`

\`Account\` に次の **公開メソッド** を実装する。

- \`new(owner: &str) -> Account\` … 残高 0 で作る（非公開フィールドがあるので、外からは構造体リテラルで作れない。これがコンストラクタ）
- \`balance(&self) -> i64\` … 残高を返す（ゲッター）
- \`deposit(&mut self, amount: i64) -> Result<i64, String>\` … \`amount\` が 0 以下なら \`Err("invalid amount")\`。成功したら新しい残高を \`Ok\` で返す
- \`withdraw(&mut self, amount: i64) -> Result<i64, String>\` … 0 以下なら \`Err("invalid amount")\`、残高不足なら \`Err("insufficient funds")\`。成功したら新しい残高

\`\`\`rust
let mut a = bank::Account::new("alice");
a.deposit(100)    // Ok(100)
a.withdraw(30)    // Ok(70)
a.withdraw(500)   // Err("insufficient funds")
a.owner           // "alice"
\`\`\``,
    hints: [
      "`impl Account { pub fn new(owner: &str) -> Account { Account { owner: owner.to_string(), balance: 0 } } }` — モジュールの中なら非公開フィールドにも触れる。",
      "メソッドにも `pub` を付け忘れないこと（E0624: method is private）。",
      '`if amount <= 0 { return Err("invalid amount".to_string()); }` から始める。',
    ],
  },
  initialCode: `mod bank {
    pub struct Account {
        pub owner: String,
        balance: i64,
    }

    impl Account {
        // ここに pub fn new / balance / deposit / withdraw を書く
    }
}
`,
  solutionCode: `mod bank {
    pub struct Account {
        pub owner: String,
        balance: i64,
    }

    impl Account {
        pub fn new(owner: &str) -> Account {
            Account { owner: owner.to_string(), balance: 0 }
        }

        pub fn balance(&self) -> i64 {
            self.balance
        }

        pub fn deposit(&mut self, amount: i64) -> Result<i64, String> {
            if amount <= 0 {
                return Err("invalid amount".to_string());
            }
            self.balance += amount;
            Ok(self.balance)
        }

        pub fn withdraw(&mut self, amount: i64) -> Result<i64, String> {
            if amount <= 0 {
                return Err("invalid amount".to_string());
            }
            if amount > self.balance {
                return Err("insufficient funds".to_string());
            }
            self.balance -= amount;
            Ok(self.balance)
        }
    }
}
`,
});
