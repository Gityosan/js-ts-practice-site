import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "入金と出金",
      expr: '{ let mut b = Bank::new(); b.open("alice", 1000); (b.deposit("alice", 500), b.withdraw("alice", 300), b.balance("alice")) }',
      expected: "(Ok(1500), Ok(1200), Some(1200))",
    },
    {
      label: "残高不足と 0 円",
      expr: '{ let mut b = Bank::new(); b.open("bob", 100); (b.withdraw("bob", 150), b.deposit("bob", 0), b.balance("bob")) }',
      expected:
        "(Err(InsufficientFunds { needed: 150, available: 100 }), Err(InvalidAmount), Some(100))",
    },
    {
      label: "送金",
      expr: '{ let mut b = Bank::new(); b.open("a", 500); b.open("b", 0); let r = b.transfer("a", "b", 200); (r, b.balance("a"), b.balance("b")) }',
      expected: "(Ok(()), Some(300), Some(200))",
    },
    {
      label: "送金失敗では残高が変わらない",
      expr: '{ let mut b = Bank::new(); b.open("a", 500); let r1 = b.transfer("a", "zzz", 100); let r2 = b.transfer("a", "a", 100); (r1, r2, b.balance("a")) }',
      expected: '(Err(AccountNotFound("zzz")), Err(SameAccount), Some(500))',
    },
    {
      label: "送金の残高不足",
      expr: '{ let mut b = Bank::new(); b.open("a", 50); b.open("b", 0); (b.transfer("a", "b", 80), b.balance("a"), b.balance("b")) }',
      expected: "(Err(InsufficientFunds { needed: 80, available: 50 }), Some(50), Some(0))",
    },
    {
      label: "無い口座",
      expr: '{ let mut b = Bank::new(); (b.deposit("x", 1), b.balance("x")) }',
      expected: '(Err(AccountNotFound("x")), None)',
    },
    {
      label: "Display",
      expr: '(BankError::AccountNotFound("x".into()).to_string(), BankError::InsufficientFunds { needed: 80, available: 50 }.to_string(), BankError::InvalidAmount.to_string(), BankError::SameAccount.to_string())',
      expected:
        '("口座 x がありません", "残高不足（必要: 80, 残高: 50）", "金額は 1 以上にしてください", "同じ口座には送金できません")',
    },
  ],
};

export default grader;
