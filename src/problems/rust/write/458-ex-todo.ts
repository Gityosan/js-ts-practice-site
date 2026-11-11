import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-ex-todo-manager",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "総合: ToDo リスト管理",
    prompt: `## やること

ToDo リストを管理する \`TodoList\` を実装しよう。

\`\`\`rust
#[derive(Debug, Clone, PartialEq)]
enum Status { Todo, Done }

#[derive(Debug, Clone, PartialEq)]
struct Task { id: u32, title: String, status: Status }

struct TodoList { tasks: Vec<Task>, next_id: u32 }
\`\`\`

| メソッド | 動き |
|---|---|
| \`new() -> TodoList\` | 空のリスト。ID は 1 から振る |
| \`add(&mut self, title: &str) -> u32\` | 未完了のタスクを追加し、振った ID を返す（ID は削除しても再利用しない） |
| \`complete(&mut self, id: u32) -> Result<(), String>\` | 完了にする。無い ID なら \`Err("ID 5 のタスクはありません")\`、既に完了なら \`Err("ID 5 は完了済みです")\`（5 の部分は実際の ID） |
| \`remove(&mut self, id: u32) -> Option<Task>\` | 削除して、そのタスクを返す（無ければ \`None\`） |
| \`pending(&self) -> Vec<&str>\` | 未完了のタスクのタイトルを ID 順に（借用で返す） |
| \`summary(&self) -> String\` | \`"完了 1 / 全 3"\` の形 |

\`pending\` が \`Vec<&str>\` を返せるのは、タイトルの \`String\` を \`self\` が持ち続けているから（戻り値は \`self\` を借用している）。`,
    hints: [
      'complete: `let task = self.tasks.iter_mut().find(|t| t.id == id).ok_or(format!("ID {id} のタスクはありません"))?;`',
      "remove: `let pos = self.tasks.iter().position(|t| t.id == id)?; Some(self.tasks.remove(pos))`",
      "pending: `self.tasks.iter().filter(|t| t.status == Status::Todo).map(|t| t.title.as_str()).collect()`",
    ],
  },
  initialCode: `#[derive(Debug, Clone, PartialEq)]
enum Status {
    Todo,
    Done,
}

#[derive(Debug, Clone, PartialEq)]
struct Task {
    id: u32,
    title: String,
    status: Status,
}

struct TodoList {
    tasks: Vec<Task>,
    next_id: u32,
}

impl TodoList {
    fn new() -> Self {
        todo!()
    }

    fn add(&mut self, title: &str) -> u32 {
        todo!()
    }

    fn complete(&mut self, id: u32) -> Result<(), String> {
        todo!()
    }

    fn remove(&mut self, id: u32) -> Option<Task> {
        todo!()
    }

    fn pending(&self) -> Vec<&str> {
        todo!()
    }

    fn summary(&self) -> String {
        todo!()
    }
}
`,
  solutionCode: `#[derive(Debug, Clone, PartialEq)]
enum Status {
    Todo,
    Done,
}

#[derive(Debug, Clone, PartialEq)]
struct Task {
    id: u32,
    title: String,
    status: Status,
}

struct TodoList {
    tasks: Vec<Task>,
    next_id: u32,
}

impl TodoList {
    fn new() -> Self {
        TodoList { tasks: Vec::new(), next_id: 1 }
    }

    fn add(&mut self, title: &str) -> u32 {
        let id = self.next_id;
        self.next_id += 1;
        self.tasks.push(Task { id, title: title.to_string(), status: Status::Todo });
        id
    }

    fn complete(&mut self, id: u32) -> Result<(), String> {
        let task = self
            .tasks
            .iter_mut()
            .find(|t| t.id == id)
            .ok_or(format!("ID {id} のタスクはありません"))?;
        if task.status == Status::Done {
            return Err(format!("ID {id} は完了済みです"));
        }
        task.status = Status::Done;
        Ok(())
    }

    fn remove(&mut self, id: u32) -> Option<Task> {
        let pos = self.tasks.iter().position(|t| t.id == id)?;
        Some(self.tasks.remove(pos))
    }

    fn pending(&self) -> Vec<&str> {
        self.tasks
            .iter()
            .filter(|t| t.status == Status::Todo)
            .map(|t| t.title.as_str())
            .collect()
    }

    fn summary(&self) -> String {
        let done = self.tasks.iter().filter(|t| t.status == Status::Done).count();
        format!("完了 {} / 全 {}", done, self.tasks.len())
    }
}
`,
});
