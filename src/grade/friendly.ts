type Rule = { name?: string; re: RegExp; format: (m: RegExpMatchArray) => string };

const rules: Rule[] = [
  {
    re: /(\S+) is not a function/,
    format: (m) => `「${m[1]}」という名前の関数が見つからないか、関数でないものを呼んでいます。`,
  },
  {
    name: "ReferenceError",
    re: /(\w+) is not defined/,
    format: (m) =>
      `「${m[1]}」がどこにも定義されていません。タイプミスか、宣言し忘れかもしれません。`,
  },
  {
    re: /Cannot read propert(?:y|ies) of (null|undefined)/,
    format: (m) =>
      `空（${m[1]}）の値のプロパティを読もうとしています。先に「あるか」を確かめてみましょう。`,
  },
  {
    name: "SyntaxError",
    re: /.*/,
    format: () =>
      `書き方の文法が崩れています。( ) { } の対応や、, ; の付け忘れを確認してみましょう。`,
  },
];

export function friendly(err: unknown): { message: string; matched: boolean } {
  const e = err as { name?: string; message?: string };
  const name = e?.name ?? "Error";
  const msg = e?.message ?? String(err);
  for (const r of rules) {
    if (r.name && r.name !== name) continue;
    const m = msg.match(r.re);
    if (m) return { message: r.format(m), matched: true };
  }
  return { message: "うまく動きませんでした。コードを見直してみましょう。", matched: false };
}
