import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-iter-playlist-ref",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "&Playlist に IntoIterator を実装して借用で回す",
    prompt: `## やること

曲のリストを持つ \`Playlist\` を、**借用したまま** \`for\` で回せるようにしよう。

\`\`\`rust
let p = Playlist::new(vec!["Intro", "Song", "Outro"]);
for s in &p {        // &Playlist を回す
    // s: &String
}
p.len()              // 回した後も p は使える
\`\`\`

- （1）\`new(songs: Vec<&str>) -> Playlist\` … \`String\` に変換して持つ
- （2）\`len(&self) -> usize\`
- （3）\`impl<'a> IntoIterator for &'a Playlist\` … \`type Item = &'a String;\`、\`type IntoIter = std::slice::Iter<'a, String>;\`。中の Vec の \`iter()\` をそのまま返せばよい
- （4）\`titles_with_numbers(p: &Playlist) -> Vec<String>\` … \`for (i, s) in p.into_iter().enumerate()\` などで \`"1: Intro"\` の形にする`,
    hints: [
      "new: `Playlist { songs: songs.into_iter().map(|s| s.to_string()).collect() }`",
      "into_iter: `self.songs.iter()`",
      '`format!("{}: {}", i + 1, s)` を push していく',
    ],
  },
  initialCode: `struct Playlist {
    songs: Vec<String>,
}

impl Playlist {
    fn new(songs: Vec<&str>) -> Playlist {
        todo!()
    }

    fn len(&self) -> usize {
        todo!()
    }
}

impl<'a> IntoIterator for &'a Playlist {
    type Item = &'a String;
    type IntoIter = std::slice::Iter<'a, String>;

    fn into_iter(self) -> Self::IntoIter {
        todo!()
    }
}

fn titles_with_numbers(p: &Playlist) -> Vec<String> {
    todo!()
}
`,
  solutionCode: `struct Playlist {
    songs: Vec<String>,
}

impl Playlist {
    fn new(songs: Vec<&str>) -> Playlist {
        Playlist {
            songs: songs.into_iter().map(|s| s.to_string()).collect(),
        }
    }

    fn len(&self) -> usize {
        self.songs.len()
    }
}

impl<'a> IntoIterator for &'a Playlist {
    type Item = &'a String;
    type IntoIter = std::slice::Iter<'a, String>;

    fn into_iter(self) -> Self::IntoIter {
        self.songs.iter()
    }
}

fn titles_with_numbers(p: &Playlist) -> Vec<String> {
    let mut out = Vec::new();
    for (i, s) in p.into_iter().enumerate() {
        out.push(format!("{}: {}", i + 1, s));
    }
    out
}
`,
});
