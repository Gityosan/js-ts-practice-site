import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-stdlib-min-max-by-key",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "min_by_key / max_by_key で最大・最小を探す",
    prompt: `## やること

\`\`\`rust
#[derive(Debug, Clone, PartialEq)]
struct City { name: String, population: u32, temp: f64 }
\`\`\`

| 関数 | 返すもの |
|---|---|
| \`most_populated(cities: &[City]) -> Option<String>\` | 人口が最大の都市の名前（\`max_by_key\`） |
| \`least_populated(cities: &[City]) -> Option<String>\` | 人口が最小の都市の名前（\`min_by_key\`） |
| \`hottest(cities: &[City]) -> Option<String>\` | 気温が最高の都市の名前。\`f64\` なので \`max_by\` と \`total_cmp\` を使う（下の説明） |
| \`temp_range(cities: &[City]) -> Option<(f64, f64)>\` | \`(最低気温, 最高気温)\`。空なら \`None\` |

どれも、空のスライスなら \`None\` を返す（\`max_by_key\` などは自動で \`None\` になる）。

\`f64\` は \`Ord\` を実装していないので \`max_by_key\` が使えない。代わりに比較関数を渡す \`max_by\` を使う。

\`\`\`rust
cities.iter().max_by(|a, b| a.temp.total_cmp(&b.temp))
\`\`\`

\`.map(|c| c.name.clone())\` で \`Option<&City>\` を \`Option<String>\` に変換できる。`,
    hints: [
      "`cities.iter().max_by_key(|c| c.population).map(|c| c.name.clone())`",
      "f64 には `max_by_key` が使えない（`Ord` でない）ので `max_by` / `min_by` に `total_cmp` を渡す",
      "temp_range: `let min = cities.iter().map(|c| c.temp).min_by(|a, b| a.total_cmp(b))?;`（`?` は Option にも使える）",
    ],
  },
  initialCode: `#[derive(Debug, Clone, PartialEq)]
struct City {
    name: String,
    population: u32,
    temp: f64,
}

fn most_populated(cities: &[City]) -> Option<String> {
    todo!()
}

fn least_populated(cities: &[City]) -> Option<String> {
    todo!()
}

fn hottest(cities: &[City]) -> Option<String> {
    todo!()
}

fn temp_range(cities: &[City]) -> Option<(f64, f64)> {
    todo!()
}
`,
  solutionCode: `#[derive(Debug, Clone, PartialEq)]
struct City {
    name: String,
    population: u32,
    temp: f64,
}

fn most_populated(cities: &[City]) -> Option<String> {
    cities.iter().max_by_key(|c| c.population).map(|c| c.name.clone())
}

fn least_populated(cities: &[City]) -> Option<String> {
    cities.iter().min_by_key(|c| c.population).map(|c| c.name.clone())
}

fn hottest(cities: &[City]) -> Option<String> {
    cities
        .iter()
        .max_by(|a, b| a.temp.total_cmp(&b.temp))
        .map(|c| c.name.clone())
}

fn temp_range(cities: &[City]) -> Option<(f64, f64)> {
    let min = cities.iter().map(|c| c.temp).min_by(|a, b| a.total_cmp(b))?;
    let max = cities.iter().map(|c| c.temp).max_by(|a, b| a.total_cmp(b))?;
    Some((min, max))
}
`,
});
