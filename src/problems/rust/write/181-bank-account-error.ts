import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-bank-withdraw-error",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "銀行口座の出金（残高不足エラー）",
    prompt: `## やること

銀行口座 \`Account\` と、操作の失敗を表す \`BankError\` を実装しよう。

\`\`\`rust
enum BankError {
    InvalidAmount,                                   // 金額が 0
    InsufficientFunds { needed: u64, available: u64 },  // 残高不足
    Frozen,                                          // 凍結中
}
\`\`\`

\`Account\` のメソッド:

- \`deposit(&mut self, amount: u64) -> Result<u64, BankError>\` … 入金して新しい残高を返す。凍結中は \`Frozen\`、0 円は \`InvalidAmount\`
- \`withdraw(&mut self, amount: u64) -> Result<u64, BankError>\` … 出金して新しい残高を返す。凍結 → 0 円 → 残高不足 の順にチェック。**失敗したら残高は変えない**
- \`transfer(&mut self, to: &mut Account, amount: u64) -> Result<(), BankError>\` … 自分から出金して相手に入金。\`?\` を使おう。**相手が凍結中なら何も変えずに Frozen**（先に相手を確認する）

\`BankError\` の Display:

- \`InvalidAmount\` → \`金額は 1 円以上にしてください\`
- \`InsufficientFunds\` → \`残高不足: あと 50 円足りません\`（needed − available）
- \`Frozen\` → \`口座が凍結されています\``,
    hints: [
      "withdraw: `if self.frozen { return Err(BankError::Frozen); }` から順に",
      "`if amount > self.balance { return Err(BankError::InsufficientFunds { needed: amount, available: self.balance }); }`",
      "transfer: `if to.frozen { return Err(BankError::Frozen); } self.withdraw(amount)?; to.deposit(amount)?; Ok(())`",
    ],
  },
  initialCode: `use std::fmt;

#[derive(Debug, PartialEq)]
enum BankError {
    InvalidAmount,
    InsufficientFunds { needed: u64, available: u64 },
    Frozen,
}

impl fmt::Display for BankError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        todo!()
    }
}

impl std::error::Error for BankError {}

#[derive(Debug)]
struct Account {
    balance: u64,
    frozen: bool,
}

impl Account {
    fn new(balance: u64) -> Self {
        Account { balance, frozen: false }
    }

    fn deposit(&mut self, amount: u64) -> Result<u64, BankError> {
        todo!()
    }

    fn withdraw(&mut self, amount: u64) -> Result<u64, BankError> {
        todo!()
    }

    fn transfer(&mut self, to: &mut Account, amount: u64) -> Result<(), BankError> {
        todo!()
    }
}
`,
  solutionCode: `use std::fmt;

#[derive(Debug, PartialEq)]
enum BankError {
    InvalidAmount,
    InsufficientFunds { needed: u64, available: u64 },
    Frozen,
}

impl fmt::Display for BankError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            BankError::InvalidAmount => write!(f, "金額は 1 円以上にしてください"),
            BankError::InsufficientFunds { needed, available } => {
                write!(f, "残高不足: あと {} 円足りません", needed - available)
            }
            BankError::Frozen => write!(f, "口座が凍結されています"),
        }
    }
}

impl std::error::Error for BankError {}

#[derive(Debug)]
struct Account {
    balance: u64,
    frozen: bool,
}

impl Account {
    fn new(balance: u64) -> Self {
        Account { balance, frozen: false }
    }

    fn deposit(&mut self, amount: u64) -> Result<u64, BankError> {
        if self.frozen {
            return Err(BankError::Frozen);
        }
        if amount == 0 {
            return Err(BankError::InvalidAmount);
        }
        self.balance += amount;
        Ok(self.balance)
    }

    fn withdraw(&mut self, amount: u64) -> Result<u64, BankError> {
        if self.frozen {
            return Err(BankError::Frozen);
        }
        if amount == 0 {
            return Err(BankError::InvalidAmount);
        }
        if amount > self.balance {
            return Err(BankError::InsufficientFunds { needed: amount, available: self.balance });
        }
        self.balance -= amount;
        Ok(self.balance)
    }

    fn transfer(&mut self, to: &mut Account, amount: u64) -> Result<(), BankError> {
        if to.frozen {
            return Err(BankError::Frozen);
        }
        self.withdraw(amount)?;
        to.deposit(amount)?;
        Ok(())
    }
}
`,
});
