import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-macro-ident-gen",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "ident で関数を生成するマクロ",
    prompt: `## やること

\`ident\`（識別子）を受け取って **関数を生成する** マクロ \`make_scaler!\` を完成させ、それを使って 3 つの関数を作ろう。

\`\`\`rust
make_scaler!(double, 2);
// ↓ に展開される
// fn double(x: i32) -> i32 { x * 2 }
\`\`\`

作る関数:

- \`make_scaler!(double, 2);\` → \`double(x)\` は \`x * 2\`
- \`make_scaler!(triple, 3);\` → \`triple(x)\` は \`x * 3\`
- \`make_scaler!(negate, -1);\` → \`negate(x)\` は \`x * -1\`

さらに、構造体 \`Point\` に **ゲッターを生成するマクロ** \`getters!\` も完成させよう。

\`\`\`rust
getters!(Point, x, y);
// impl Point { fn x(&self) -> i32 { self.x } fn y(&self) -> i32 { self.y } }
\`\`\`

フィールドは何個でも渡せるように \`$( $field:ident ),*\` で受け取る。`,
    hints: [
      "`fn $name(x: i32) -> i32 { x * $factor }`",
      "マクロの呼び出し `make_scaler!(double, 2);` はファイルのトップレベルに書ける",
      "`impl $t { $( fn $field(&self) -> i32 { self.$field } )* }`",
    ],
  },
  initialCode: `macro_rules! make_scaler {
    ($name:ident, $factor:expr) => {
        fn $name(x: i32) -> i32 {
            todo!()
        }
    };
}

make_scaler!(double, 2);
// triple と negate も作ろう

struct Point {
    x: i32,
    y: i32,
}

macro_rules! getters {
    ($t:ident, $( $field:ident ),*) => {
        // ここに impl を生成する
    };
}

getters!(Point, x, y);
`,
  solutionCode: `macro_rules! make_scaler {
    ($name:ident, $factor:expr) => {
        fn $name(x: i32) -> i32 {
            x * $factor
        }
    };
}

make_scaler!(double, 2);
make_scaler!(triple, 3);
make_scaler!(negate, -1);

struct Point {
    x: i32,
    y: i32,
}

macro_rules! getters {
    ($t:ident, $( $field:ident ),*) => {
        impl $t {
            $(
                fn $field(&self) -> i32 {
                    self.$field
                }
            )*
        }
    };
}

getters!(Point, x, y);
`,
});
