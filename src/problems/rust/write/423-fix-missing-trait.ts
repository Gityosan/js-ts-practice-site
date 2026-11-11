import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-fix-e0277-trait-bound",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "E0277 を直す: トレイトが足りない",
    prompt: `## やること

初期コードは **E0277（トレイトが実装されていない）** や、その仲間の E0369（演算子が使えない）、E0308（\`Clone\` がないので \`a.clone()\` が \`&Item\` の複製になり型が合わない）でコンパイルできない。どれも原因は「トレイトが足りない」こと。次の 2 か所を直そう。

- 構造体 \`Item\` を \`{:?}\` で表示したり、\`==\` で比べたり、\`.clone()\` したりしている。必要なトレイトを \`#[derive(...)]\` で付ける（\`Debug\`, \`Clone\`, \`PartialEq\`）
- ジェネリック関数 \`max_of<T>(items: &[T]) -> Option<T>\` は、要素を \`>\` で比べ、\`.clone()\` で返している。型引数 \`T\` に **トレイト境界** \`PartialOrd + Clone\` を付ける

関数の中身は変えなくてよい。


※ この問題の初期コードは **わざとコンパイルが通らない** ようになっている。エラーメッセージを読んで直そう。`,
    hints: [
      "`#[derive(Debug, Clone, PartialEq)]` を struct の上に書く",
      "`fn max_of<T: PartialOrd + Clone>(items: &[T]) -> Option<T>`",
      "エラーの `help: consider restricting type parameter` に答えが書いてある",
    ],
  },
  initialCode: `struct Item {
    name: String,
    price: u32,
}

fn cheaper(a: &Item, b: &Item) -> Item {
    if a.price <= b.price { a.clone() } else { b.clone() }
}

fn show(item: &Item) -> String {
    format!("{:?}", item)
}

fn same(a: &Item, b: &Item) -> bool {
    a == b
}

fn max_of<T>(items: &[T]) -> Option<T> {
    let mut best = items.first()?;
    for x in items {
        if x > best {
            best = x;
        }
    }
    Some(best.clone())
}
`,
  solutionCode: `#[derive(Debug, Clone, PartialEq)]
struct Item {
    name: String,
    price: u32,
}

fn cheaper(a: &Item, b: &Item) -> Item {
    if a.price <= b.price { a.clone() } else { b.clone() }
}

fn show(item: &Item) -> String {
    format!("{:?}", item)
}

fn same(a: &Item, b: &Item) -> bool {
    a == b
}

fn max_of<T: PartialOrd + Clone>(items: &[T]) -> Option<T> {
    let mut best = items.first()?;
    for x in items {
        if x > best {
            best = x;
        }
    }
    Some(best.clone())
}
`,
});
