import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "入金と出金",
      expr: "{ let mut a = Account::new(100); (a.deposit(50), a.withdraw(30), a.balance) }",
      expected: "(Ok(150), Ok(120), 120)",
    },
    {
      label: "残高不足（残高は変わらない）",
      expr: "{ let mut a = Account::new(100); (a.withdraw(150), a.balance) }",
      expected: "(Err(InsufficientFunds { needed: 150, available: 100 }), 100)",
    },
    {
      label: "0 円と凍結",
      expr: "{ let mut a = Account::new(10); let r1 = a.withdraw(0); a.frozen = true; (r1, a.deposit(5), a.withdraw(1)) }",
      expected: "(Err(InvalidAmount), Err(Frozen), Err(Frozen))",
    },
    {
      label: "送金",
      expr: "{ let mut a = Account::new(100); let mut b = Account::new(5); (a.transfer(&mut b, 40), a.balance, b.balance) }",
      expected: "(Ok(()), 60, 45)",
    },
    {
      label: "送金の失敗（どちらも変わらない）",
      expr: "{ let mut a = Account::new(100); let mut b = Account::new(5); let r1 = a.transfer(&mut b, 500); b.frozen = true; let r2 = a.transfer(&mut b, 10); (r1, r2, a.balance, b.balance) }",
      expected: "(Err(InsufficientFunds { needed: 500, available: 100 }), Err(Frozen), 100, 5)",
    },
    {
      label: "Display",
      expr: "{ let mut a = Account::new(100); [a.withdraw(150).unwrap_err().to_string(), BankError::InvalidAmount.to_string(), BankError::Frozen.to_string()] }",
      expected:
        '["残高不足: あと 50 円足りません", "金額は 1 円以上にしてください", "口座が凍結されています"]',
    },
  ],
};

export default grader;
