import type { RustGraderDef } from "../../grade/types";

const grader: RustGraderDef = {
  kind: "rust",
  mode: "harness",
  cases: [
    {
      label: "ID は 1 から",
      expr: '{ let mut l = TodoList::new(); (l.add("買い物"), l.add("掃除")) }',
      expected: "(1, 2)",
    },
    {
      label: "完了と未完了",
      expr: '{ let mut l = TodoList::new(); l.add("a"); l.add("b"); l.add("c"); l.complete(2).unwrap(); let p: Vec<String> = l.pending().iter().map(|s| s.to_string()).collect(); (p, l.summary()) }',
      expected: '(["a", "c"], "完了 1 / 全 3")',
    },
    {
      label: "エラー",
      expr: '{ let mut l = TodoList::new(); l.add("a"); l.complete(1).unwrap(); (l.complete(1), l.complete(9)) }',
      expected: '(Err("ID 1 は完了済みです"), Err("ID 9 のタスクはありません"))',
    },
    {
      label: "削除",
      expr: '{ let mut l = TodoList::new(); l.add("a"); l.add("b"); let r = l.remove(1); (r.map(|t| t.title), l.remove(1).is_none(), l.summary()) }',
      expected: '(Some("a"), true, "完了 0 / 全 1")',
    },
    {
      label: "ID は再利用しない",
      expr: '{ let mut l = TodoList::new(); l.add("a"); l.remove(1); l.add("b") }',
      expected: "2",
    },
    {
      label: "空のリスト",
      expr: "{ let l = TodoList::new(); let p: Vec<String> = l.pending().iter().map(|s| s.to_string()).collect(); (p, l.summary()) }",
      expected: '([], "完了 0 / 全 0")',
    },
  ],
};

export default grader;
