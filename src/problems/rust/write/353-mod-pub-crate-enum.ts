import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-mod-pub-crate-enum",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "pub(crate) と enum の可視性",
    prompt: `## やること

\`shop\` モジュールの中に、可視性の違う要素を作ろう。

\`\`\`rust
mod shop {
    #[derive(Debug, Clone, Copy, PartialEq)]
    pub enum Size { Small, Medium, Large }   // enum は pub にすると全バリアントが公開

    #[derive(Debug)]
    pub struct Order {
        pub item: String,       // どこからでも
        pub(crate) size: Size,  // クレートの中からだけ
        price: u32,             // shop の中からだけ
    }
}
\`\`\`

- \`Order::new(item: &str, size: Size) -> Order\`（公開）… 値段は \`base_price(size)\` で決める
- \`base_price(size: Size) -> u32\`（**非公開**。shop の中だけで使う）… Small 300 / Medium 400 / Large 500
- \`Order::price(&self) -> u32\`（公開）… 非公開フィールド \`price\` を返す
- \`Order::upsize(&mut self)\`（公開）… サイズを 1 段階上げて値段も更新（Large はそのまま）
- \`shop::total(orders: &[Order]) -> u32\`（\`pub(crate)\`）… 合計金額

\`\`\`rust
let mut o = shop::Order::new("coffee", shop::Size::Small);
o.price()   // 300
o.upsize();
o.size      // Medium（pub(crate) なのでクレートルートから読める）
o.price()   // 400
\`\`\``,
    hints: [
      "`fn base_price(size: Size) -> u32 { match size { Size::Small => 300, Size::Medium => 400, Size::Large => 500 } }`（pub なし）",
      "`upsize` は `self.size = match self.size { Size::Small => Size::Medium, Size::Medium => Size::Large, Size::Large => Size::Large };` の後に `self.price = base_price(self.size);`。",
      "`pub(crate) fn total(orders: &[Order]) -> u32 { orders.iter().map(|o| o.price).sum() }` — shop の中なので非公開フィールドに触れる。",
    ],
  },
  initialCode: `mod shop {
    #[derive(Debug, Clone, Copy, PartialEq)]
    pub enum Size {
        Small,
        Medium,
        Large,
    }

    #[derive(Debug)]
    pub struct Order {
        pub item: String,
        pub(crate) size: Size,
        price: u32,
    }

    fn base_price(size: Size) -> u32 {
        todo!()
    }

    impl Order {
        pub fn new(item: &str, size: Size) -> Order {
            todo!()
        }

        pub fn price(&self) -> u32 {
            todo!()
        }

        pub fn upsize(&mut self) {
            todo!()
        }
    }

    pub(crate) fn total(orders: &[Order]) -> u32 {
        todo!()
    }
}
`,
  solutionCode: `mod shop {
    #[derive(Debug, Clone, Copy, PartialEq)]
    pub enum Size {
        Small,
        Medium,
        Large,
    }

    #[derive(Debug)]
    pub struct Order {
        pub item: String,
        pub(crate) size: Size,
        price: u32,
    }

    fn base_price(size: Size) -> u32 {
        match size {
            Size::Small => 300,
            Size::Medium => 400,
            Size::Large => 500,
        }
    }

    impl Order {
        pub fn new(item: &str, size: Size) -> Order {
            Order { item: item.to_string(), size, price: base_price(size) }
        }

        pub fn price(&self) -> u32 {
            self.price
        }

        pub fn upsize(&mut self) {
            self.size = match self.size {
                Size::Small => Size::Medium,
                Size::Medium => Size::Large,
                Size::Large => Size::Large,
            };
            self.price = base_price(self.size);
        }
    }

    pub(crate) fn total(orders: &[Order]) -> u32 {
        orders.iter().map(|o| o.price).sum()
    }
}
`,
});
