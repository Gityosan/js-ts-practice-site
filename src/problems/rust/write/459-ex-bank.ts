import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ex-bank-system",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "総合: 簡易銀行システム",
    prompt: `## やること

口座の開設・入金・出金・送金ができる \`Bank\` を作ろう。エラーは enum で表し、\`Display\` も実装する。

\`\`\`rust
#[derive(Debug, PartialEq)]
enum BankError {
    AccountNotFound(String),
    InsufficientFunds { needed: u64, available: u64 },
    InvalidAmount,
    SameAccount,
}
\`\`\`

### Display の表示

| エラー | 表示 |
|---|---|
| \`AccountNotFound(名前)\` | \`口座 名前 がありません\` |
| \`InsufficientFunds { needed, available }\` | \`残高不足（必要: needed, 残高: available）\` |
| \`InvalidAmount\` | \`金額は 1 以上にしてください\` |
| \`SameAccount\` | \`同じ口座には送金できません\` |

### Bank のメソッド

| メソッド | 動き |
|---|---|
| \`new()\` | 口座なし |
| \`open(&mut self, name: &str, initial: u64)\` | 口座を開く（初期残高つき） |
| \`balance(&self, name: &str) -> Option<u64>\` | 残高 |
| \`deposit(&mut self, name: &str, amount: u64) -> Result<u64, BankError>\` | 入金して新しい残高を返す |
| \`withdraw(&mut self, name: &str, amount: u64) -> Result<u64, BankError>\` | 出金して新しい残高を返す |
| \`transfer(&mut self, from: &str, to: &str, amount: u64) -> Result<(), BankError>\` | 送金 |

### エラーを調べる順番

- \`amount == 0\` なら \`InvalidAmount\`
- （transfer のみ）\`from == to\` なら \`SameAccount\`
- 口座が無ければ \`AccountNotFound\`（transfer は \`from\` → \`to\` の順に調べる）
- 残高が足りなければ \`InsufficientFunds\`

**エラーのときは、どの残高も変えない** こと（送金で、出金だけして入金に失敗する、ということがないように、先にすべて確認する）。`,
    hints: [
      "`self.accounts.get_mut(name).ok_or(BankError::AccountNotFound(name.to_string()))?`",
      "transfer は、両方の口座の存在と残高を確認してから、`from` を減らし `to` を増やす",
      'Display: `match self { BankError::AccountNotFound(n) => write!(f, "口座 {n} がありません"), ... }`',
    ],
  },
  initialCode: `use std::collections::HashMap;
use std::fmt;

#[derive(Debug, PartialEq)]
enum BankError {
    AccountNotFound(String),
    InsufficientFunds { needed: u64, available: u64 },
    InvalidAmount,
    SameAccount,
}

impl fmt::Display for BankError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}

struct Bank {
    accounts: HashMap<String, u64>,
}

impl Bank {
    fn new() -> Self {
        Bank { accounts: HashMap::new() }
    }

    fn open(&mut self, name: &str, initial: u64) {
        todo!()
    }

    fn balance(&self, name: &str) -> Option<u64> {
        todo!()
    }

    fn deposit(&mut self, name: &str, amount: u64) -> Result<u64, BankError> {
        todo!()
    }

    fn withdraw(&mut self, name: &str, amount: u64) -> Result<u64, BankError> {
        todo!()
    }

    fn transfer(&mut self, from: &str, to: &str, amount: u64) -> Result<(), BankError> {
        todo!()
    }
}
`,
  solutionCode: `use std::collections::HashMap;
use std::fmt;

#[derive(Debug, PartialEq)]
enum BankError {
    AccountNotFound(String),
    InsufficientFunds { needed: u64, available: u64 },
    InvalidAmount,
    SameAccount,
}

impl fmt::Display for BankError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            BankError::AccountNotFound(n) => write!(f, "口座 {n} がありません"),
            BankError::InsufficientFunds { needed, available } => {
                write!(f, "残高不足（必要: {needed}, 残高: {available}）")
            }
            BankError::InvalidAmount => write!(f, "金額は 1 以上にしてください"),
            BankError::SameAccount => write!(f, "同じ口座には送金できません"),
        }
    }
}

struct Bank {
    accounts: HashMap<String, u64>,
}

impl Bank {
    fn new() -> Self {
        Bank { accounts: HashMap::new() }
    }

    fn open(&mut self, name: &str, initial: u64) {
        self.accounts.insert(name.to_string(), initial);
    }

    fn balance(&self, name: &str) -> Option<u64> {
        self.accounts.get(name).copied()
    }

    fn deposit(&mut self, name: &str, amount: u64) -> Result<u64, BankError> {
        if amount == 0 {
            return Err(BankError::InvalidAmount);
        }
        let bal = self
            .accounts
            .get_mut(name)
            .ok_or(BankError::AccountNotFound(name.to_string()))?;
        *bal += amount;
        Ok(*bal)
    }

    fn withdraw(&mut self, name: &str, amount: u64) -> Result<u64, BankError> {
        if amount == 0 {
            return Err(BankError::InvalidAmount);
        }
        let bal = self
            .accounts
            .get_mut(name)
            .ok_or(BankError::AccountNotFound(name.to_string()))?;
        if *bal < amount {
            return Err(BankError::InsufficientFunds { needed: amount, available: *bal });
        }
        *bal -= amount;
        Ok(*bal)
    }

    fn transfer(&mut self, from: &str, to: &str, amount: u64) -> Result<(), BankError> {
        if amount == 0 {
            return Err(BankError::InvalidAmount);
        }
        if from == to {
            return Err(BankError::SameAccount);
        }
        let available = self
            .balance(from)
            .ok_or(BankError::AccountNotFound(from.to_string()))?;
        if !self.accounts.contains_key(to) {
            return Err(BankError::AccountNotFound(to.to_string()));
        }
        if available < amount {
            return Err(BankError::InsufficientFunds { needed: amount, available });
        }
        *self.accounts.get_mut(from).unwrap() -= amount;
        *self.accounts.get_mut(to).unwrap() += amount;
        Ok(())
    }
}
`,
});
