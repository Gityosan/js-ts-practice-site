import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-closure-sort-key",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "sort_by_key / max_by_key / retain でクロージャを使う",
    prompt: `## やること

\`(名前, 年齢)\` のタプルの Vec を、クロージャを渡すメソッドで処理しよう。

- （1）\`by_age(people: Vec<(String, u32)>) -> Vec<String>\` … 年齢の **昇順** に並べた名前の一覧（同じ年齢なら元の順。\`sort_by_key\` は安定ソート）
- （2）\`by_name_len_desc(people: Vec<(String, u32)>) -> Vec<String>\` … 名前の **長い順**（同じ長さなら元の順）。キーに \`std::cmp::Reverse(...)\` を使う
- （3）\`oldest(people: &[(String, u32)]) -> Option<String>\` … 一番年上の名前。\`iter().max_by_key(...)\`（同じ年齢が複数なら **最後** のものが返る）
- （4）\`adults(people: Vec<(String, u32)>) -> Vec<String>\` … 20 歳以上だけを \`retain\` で残した名前の一覧

\`\`\`rust
let p = vec![("Bob".to_string(), 30), ("Amy".to_string(), 17), ("Cid".to_string(), 45)];
by_age(p)   // ["Amy", "Bob", "Cid"]
\`\`\``,
    hints: [
      "`let mut v = people; v.sort_by_key(|p| p.1);`",
      "`v.sort_by_key(|p| std::cmp::Reverse(p.0.len()));`",
      "`people.iter().max_by_key(|p| p.1).map(|p| p.0.clone())`、`v.retain(|p| p.1 >= 20);`",
    ],
  },
  initialCode: `fn names(v: Vec<(String, u32)>) -> Vec<String> {
    let mut out = Vec::new();
    for (name, _) in v {
        out.push(name);
    }
    out
}

fn by_age(people: Vec<(String, u32)>) -> Vec<String> {
    todo!()
}

fn by_name_len_desc(people: Vec<(String, u32)>) -> Vec<String> {
    todo!()
}

fn oldest(people: &[(String, u32)]) -> Option<String> {
    todo!()
}

fn adults(people: Vec<(String, u32)>) -> Vec<String> {
    todo!()
}
`,
  solutionCode: `fn names(v: Vec<(String, u32)>) -> Vec<String> {
    let mut out = Vec::new();
    for (name, _) in v {
        out.push(name);
    }
    out
}

fn by_age(people: Vec<(String, u32)>) -> Vec<String> {
    let mut v = people;
    v.sort_by_key(|p| p.1);
    names(v)
}

fn by_name_len_desc(people: Vec<(String, u32)>) -> Vec<String> {
    let mut v = people;
    v.sort_by_key(|p| std::cmp::Reverse(p.0.len()));
    names(v)
}

fn oldest(people: &[(String, u32)]) -> Option<String> {
    people.iter().max_by_key(|p| p.1).map(|p| p.0.clone())
}

fn adults(people: Vec<(String, u32)>) -> Vec<String> {
    let mut v = people;
    v.retain(|p| p.1 >= 20);
    names(v)
}
`,
});
