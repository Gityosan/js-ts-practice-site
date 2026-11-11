import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "作った直後",
      expr: '{ let a = bank::Account::new("alice"); (a.owner.clone(), a.balance()) }',
      expected: '("alice", 0)',
    },
    {
      label: "入金と出金",
      expr: '{ let mut a = bank::Account::new("a"); (a.deposit(100), a.withdraw(30), a.balance()) }',
      expected: "(Ok(100), Ok(70), 70)",
    },
    {
      label: "残高不足",
      expr: '{ let mut a = bank::Account::new("a"); a.deposit(50).unwrap(); (a.withdraw(80), a.balance()) }',
      expected: '(Err("insufficient funds"), 50)',
    },
    {
      label: "不正な金額",
      expr: '{ let mut a = bank::Account::new("a"); (a.deposit(0), a.withdraw(-5)) }',
      expected: '(Err("invalid amount"), Err("invalid amount"))',
    },
    {
      label: "owner は公開なので書き換えられる",
      expr: '{ let mut a = bank::Account::new("a"); a.owner = String::from("b"); a.owner }',
      expected: '"b"',
    },
  ],
};

export default grader;
