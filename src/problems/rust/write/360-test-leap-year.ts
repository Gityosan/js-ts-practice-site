import { defineProblem } from "../../../core/schemas";

export default defineProblem({
  id: "rust-test-leap-year",
  stage: "write",
  language: "rust",
  scenario: "rust",
  copy: {
    title: "テストが通るように関数を書く",
    prompt: `## やること

**うるう年判定** \`is_leap_year(year: u32) -> bool\` を書こう。初期コードには、手元で \`cargo test\` すると実行される **テストモジュール** が付いている。テストを読んで仕様を確かめ、すべて通るように実装しよう。

うるう年のルール:

- 4 で割り切れる年はうるう年
- ただし 100 で割り切れる年はうるう年ではない
- ただし 400 で割り切れる年はうるう年

さらに \`days_in_month(year: u32, month: u32) -> u32\` も書く。2 月はうるう年なら 29、そうでなければ 28。4・6・9・11 月は 30、それ以外は 31。

## 採点

このサイトでは \`cargo test\` の代わりに、採点側がテストと同じ呼び出しをして結果を比べる。\`#[cfg(test)] mod tests\` は通常のコンパイルでは無視されるので、そのまま残しておいてよい。`,
    hints: [
      "テストの `assert!(!is_leap_year(1900));` などから、ルールの例外を読み取ろう。",
      "`year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)`",
      "`days_in_month` は `match month { 2 => if is_leap_year(year) { 29 } else { 28 }, 4 | 6 | 9 | 11 => 30, _ => 31 }`。",
    ],
  },
  initialCode: `fn is_leap_year(year: u32) -> bool {
    todo!()
}

fn days_in_month(year: u32, month: u32) -> u32 {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn divisible_by_4_is_leap() {
        assert!(is_leap_year(2024));
    }

    #[test]
    fn century_is_not_leap() {
        assert!(!is_leap_year(1900));
    }

    #[test]
    fn divisible_by_400_is_leap() {
        assert!(is_leap_year(2000));
    }

    #[test]
    fn february_days() {
        assert_eq!(days_in_month(2024, 2), 29);
        assert_eq!(days_in_month(2023, 2), 28);
        assert_ne!(days_in_month(1900, 2), 29);
    }
}
`,
  solutionCode: `fn is_leap_year(year: u32) -> bool {
    year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)
}

fn days_in_month(year: u32, month: u32) -> u32 {
    match month {
        2 => {
            if is_leap_year(year) {
                29
            } else {
                28
            }
        }
        4 | 6 | 9 | 11 => 30,
        _ => 31,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn divisible_by_4_is_leap() {
        assert!(is_leap_year(2024));
    }

    #[test]
    fn century_is_not_leap() {
        assert!(!is_leap_year(1900));
    }

    #[test]
    fn divisible_by_400_is_leap() {
        assert!(is_leap_year(2000));
    }

    #[test]
    fn february_days() {
        assert_eq!(days_in_month(2024, 2), 29);
        assert_eq!(days_in_month(2023, 2), 28);
        assert_ne!(days_in_month(1900, 2), 29);
    }
}
`,
});
