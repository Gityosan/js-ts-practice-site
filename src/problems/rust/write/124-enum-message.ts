import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-enum-message-process",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "データを持つ enum: コマンドを処理する",
    prompt: `## やること

ロボットへの命令を表す enum \`Command\` と、位置と向きを持つ \`Robot\` がある。

\`\`\`rust
enum Command {
    Forward(i32),         // 向いている方向に n 進む
    TurnLeft,             // 左に 90 度回る
    TurnRight,            // 右に 90 度回る
    Teleport { x: i32, y: i32 },  // その座標へ瞬間移動
}
\`\`\`

\`Robot\` の向き \`dir\` は \`Dir\` enum（North / East / South / West）。North は y が増える方向、East は x が増える方向。

- \`Dir\` に \`left(self) -> Dir\` と \`right(self) -> Dir\` を実装（North の右は East）
- \`Robot\` に \`apply(&mut self, cmd: &Command)\` を実装

\`\`\`rust
let mut r = Robot { x: 0, y: 0, dir: Dir::North };
r.apply(&Command::Forward(3));   // (0, 3)
r.apply(&Command::TurnRight);    // East を向く
r.apply(&Command::Forward(2));   // (2, 3)
\`\`\``,
    hints: [
      "`Dir::North => Dir::West` のように left を書く",
      "apply: `match cmd { Command::Forward(n) => match self.dir { Dir::North => self.y += n, ... }, ... }`",
      "`Command::Teleport { x, y } => { self.x = *x; self.y = *y; }`（cmd が参照なので x は &i32）",
    ],
  },
  initialCode: `#[derive(Debug, Clone, Copy, PartialEq)]
enum Dir {
    North,
    East,
    South,
    West,
}

#[derive(Debug)]
enum Command {
    Forward(i32),
    TurnLeft,
    TurnRight,
    Teleport { x: i32, y: i32 },
}

#[derive(Debug)]
struct Robot {
    x: i32,
    y: i32,
    dir: Dir,
}

impl Dir {
    fn left(self) -> Dir {
        todo!()
    }

    fn right(self) -> Dir {
        todo!()
    }
}

impl Robot {
    fn apply(&mut self, cmd: &Command) {
        todo!()
    }
}
`,
  solutionCode: `#[derive(Debug, Clone, Copy, PartialEq)]
enum Dir {
    North,
    East,
    South,
    West,
}

#[derive(Debug)]
enum Command {
    Forward(i32),
    TurnLeft,
    TurnRight,
    Teleport { x: i32, y: i32 },
}

#[derive(Debug)]
struct Robot {
    x: i32,
    y: i32,
    dir: Dir,
}

impl Dir {
    fn left(self) -> Dir {
        match self {
            Dir::North => Dir::West,
            Dir::West => Dir::South,
            Dir::South => Dir::East,
            Dir::East => Dir::North,
        }
    }

    fn right(self) -> Dir {
        match self {
            Dir::North => Dir::East,
            Dir::East => Dir::South,
            Dir::South => Dir::West,
            Dir::West => Dir::North,
        }
    }
}

impl Robot {
    fn apply(&mut self, cmd: &Command) {
        match cmd {
            Command::Forward(n) => match self.dir {
                Dir::North => self.y += n,
                Dir::South => self.y -= n,
                Dir::East => self.x += n,
                Dir::West => self.x -= n,
            },
            Command::TurnLeft => self.dir = self.dir.left(),
            Command::TurnRight => self.dir = self.dir.right(),
            Command::Teleport { x, y } => {
                self.x = *x;
                self.y = *y;
            }
        }
    }
}
`,
});
