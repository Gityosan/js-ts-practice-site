import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-mod-paths-use",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "crate / self / super と use / pub use",
    prompt: `## やること

パスのキーワード \`crate\`・\`self\`・\`super\` と、\`use\`・\`as\`・\`pub use\` を使い分けよう。

クレートルートに定数 \`SCALE\`（1 cm = 10 mm）がある。次の構造を作る。

\`\`\`text
crate
 ├── SCALE: i32 = 10
 ├── units                      … pub ではないが、クレートルートの子なのでルートから使える
 │   ├── length (pub mod)
 │   │   └── to_mm(cm) -> i32   … crate::SCALE を使う
 │   ├── area (pub mod)
 │   │   └── square_mm(cm) -> i32 … super::length::to_mm で辺を mm にしてから 2 乗
 │   └── pub use self::length::to_mm as cm_to_mm;  … units::cm_to_mm として再公開
 └── use units::area::square_mm as sq_mm;  … ルートで別名を付ける
\`\`\`

\`\`\`rust
units::length::to_mm(3)      // 30
units::cm_to_mm(3)           // 30（再公開した名前）
units::area::square_mm(2)    // 400（20mm × 20mm）
sq_mm(1)                     // 100（ルートの use で付けた別名）
\`\`\``,
    hints: [
      "`pub fn to_mm(cm: i32) -> i32 { cm * crate::SCALE }`",
      "`area` の中では `let side = super::length::to_mm(cm);`（super は units）。",
      "`units` の中に `pub use self::length::to_mm as cm_to_mm;`、ルートに `use units::area::square_mm as sq_mm;`。",
    ],
  },
  initialCode: `const SCALE: i32 = 10;

mod units {
    pub mod length {
        pub fn to_mm(cm: i32) -> i32 {
            todo!()
        }
    }

    pub mod area {
        pub fn square_mm(cm: i32) -> i32 {
            todo!()
        }
    }

    // ここに pub use で cm_to_mm を再公開する
}

// ここに use で sq_mm という別名を付ける
`,
  solutionCode: `const SCALE: i32 = 10;

mod units {
    pub mod length {
        pub fn to_mm(cm: i32) -> i32 {
            cm * crate::SCALE
        }
    }

    pub mod area {
        pub fn square_mm(cm: i32) -> i32 {
            let side = super::length::to_mm(cm);
            side * side
        }
    }

    pub use self::length::to_mm as cm_to_mm;
}

use units::area::square_mm as sq_mm;
`,
});
