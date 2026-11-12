import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-types-phantom-units",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "PhantomData で単位を型にする",
    prompt: `## やること

長さ \`Length<U>\` の **単位を型引数 \`U\` で表す**。\`U\` はフィールドで使わないので \`PhantomData<U>\` を持たせる。

\`\`\`rust
#[derive(Debug, Clone, Copy, PartialEq)]
struct Cm;
#[derive(Debug, Clone, Copy, PartialEq)]
struct Mm;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Length<U> {
    value: i64,
    _unit: PhantomData<U>,
}
\`\`\`

- \`Length::new(value) -> Length<U>\` … 作る（\`U\` は型注釈か推論で決まる）
- \`Add for Length<U>\` … **同じ単位同士だけ** 足せる（\`Length<Cm> + Length<Mm>\` はコンパイルエラーになる）
- \`to_mm(l: Length<Cm>) -> Length<Mm>\` … 1 cm = 10 mm
- \`total_mm(cms: &[Length<Cm>], mms: &[Length<Mm>]) -> i64\` … 全部 mm にそろえて合計した値

\`\`\`rust
let a: Length<Cm> = Length::new(3);
let b: Length<Cm> = Length::new(4);
(a + b).value              // 7
to_mm(a).value             // 30
total_mm(&[a], &[Length::new(5)]) // 35
\`\`\``,
    hints: [
      "`impl<U> Length<U> { fn new(value: i64) -> Self { Length { value, _unit: PhantomData } } }`",
      "`impl<U> Add for Length<U> { type Output = Length<U>; fn add(self, o: Self) -> Self { Length::new(self.value + o.value) } }`",
      "`total_mm` は `cms.iter().map(|&c| to_mm(c).value).sum::<i64>() + mms.iter().map(|m| m.value).sum::<i64>()`。",
    ],
  },
  initialCode: `use std::marker::PhantomData;
use std::ops::Add;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Cm;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Mm;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Length<U> {
    value: i64,
    _unit: PhantomData<U>,
}

impl<U> Length<U> {
    fn new(value: i64) -> Self {
        todo!()
    }
}

// ここに impl<U> Add for Length<U> を書く

fn to_mm(l: Length<Cm>) -> Length<Mm> {
    todo!()
}

fn total_mm(cms: &[Length<Cm>], mms: &[Length<Mm>]) -> i64 {
    todo!()
}
`,
  solutionCode: `use std::marker::PhantomData;
use std::ops::Add;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Cm;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Mm;

#[derive(Debug, Clone, Copy, PartialEq)]
struct Length<U> {
    value: i64,
    _unit: PhantomData<U>,
}

impl<U> Length<U> {
    fn new(value: i64) -> Self {
        Length { value, _unit: PhantomData }
    }
}

impl<U> Add for Length<U> {
    type Output = Length<U>;
    fn add(self, o: Self) -> Self {
        Length::new(self.value + o.value)
    }
}

fn to_mm(l: Length<Cm>) -> Length<Mm> {
    Length::new(l.value * 10)
}

fn total_mm(cms: &[Length<Cm>], mms: &[Length<Mm>]) -> i64 {
    cms.iter().map(|&c| to_mm(c).value).sum::<i64>() + mms.iter().map(|m| m.value).sum::<i64>()
}
`,
});
