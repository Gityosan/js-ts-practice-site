import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-generic-either",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "2 つの型パラメータを持つ enum Either<L, R>",
    prompt: `## やること

「左か右のどちらか」を表すジェネリックな enum \`Either<L, R>\` にメソッドを実装しよう。

\`\`\`rust
enum Either<L, R> {
    Left(L),
    Right(R),
}
\`\`\`

| メソッド | 動き |
|---|---|
| \`is_left(&self) -> bool\` | Left なら true |
| \`left(self) -> Option<L>\` | Left なら \`Some(値)\`、Right なら \`None\` |
| \`flip(self) -> Either<R, L>\` | Left と Right を入れ替える（型も入れ替わる） |

\`\`\`rust
let a: Either<i32, &str> = Either::Left(3);
a.flip()  // Either::Right(3)  （型は Either<&str, i32>）
\`\`\`

\`Option<T>\` や \`Result<T, E>\` も、こうしたジェネリックな enum として定義されている。`,
    hints: [
      "`impl<L, R> Either<L, R> { ... }` と型パラメータを 2 つ宣言する",
      "`match self { Either::Left(v) => ..., Either::Right(v) => ... }`",
      "`is_left` は `matches!(self, Either::Left(_))` でも書ける",
    ],
  },
  initialCode: `#[derive(Debug)]
enum Either<L, R> {
    Left(L),
    Right(R),
}

impl<L, R> Either<L, R> {
    fn is_left(&self) -> bool {
        todo!()
    }

    fn left(self) -> Option<L> {
        todo!()
    }

    fn flip(self) -> Either<R, L> {
        todo!()
    }
}
`,
  solutionCode: `#[derive(Debug)]
enum Either<L, R> {
    Left(L),
    Right(R),
}

impl<L, R> Either<L, R> {
    fn is_left(&self) -> bool {
        matches!(self, Either::Left(_))
    }

    fn left(self) -> Option<L> {
        match self {
            Either::Left(v) => Some(v),
            Either::Right(_) => None,
        }
    }

    fn flip(self) -> Either<R, L> {
        match self {
            Either::Left(v) => Either::Right(v),
            Either::Right(v) => Either::Left(v),
        }
    }
}
`,
});
