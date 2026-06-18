# 初学者向け JS/TS 学習サイト — 仕様書 (handoff for Claude Code)

> プログラミングサークル新歓〜入口の「呼水」となる学習サイト。
> 本書は設計の確定事項・根拠・確定コード・未決事項をまとめた引き継ぎ仕様。
> `runGrader` 本体の設計は本書確定後に別途進める（末尾「未決事項」参照）。

---

## 0. 目的とポジショニング

- **対象**: プログラミング未経験、エンジニアになるか不明な層。サークル新歓の funnel 入口。
- **最適化対象**: 習得の深さではなく、(1) 最初の5分で離脱させないこと、(2)「コードはこわくない／自分にもいじれる」体験を一発入れること。
- **価値の重心**: 情報提供（＝LLM/Progateで代替可能）ではなく、「**構造を読む力**」と「**productive struggle（ちょうどいい詰まり）の制御**」に置く。生のチャットがやらない「答えを出さず段階的に詰まらせる」装置を志向する。

---

## 1. 教育設計

### 1.1 解読 (decoding) 優先

コードの一行を次の構造で分解して読む訓練を中核に据える。

- **keyword（予約語 / 構造を作る言葉）** → `const` `function` `if` `while` など
- **`( )`（条件・引数）**
- **`{ }`（処理の集合体）**

既存手法との差分（＝空白地帯）:

| 手法 | 訓練するもの | 本サイトとの関係 |
|---|---|---|
| Parsons problems | 行の**並べ替え** | 近いが粒度が違う（行間 vs 行内構造） |
| EiPE (Explain in Plain English) | 各行の**意味の説明** | 構造ではなく意味 |
| code tracing | **実行の追跡** | 別軸 |
| **本サイト** | **構造の骨格を読む** | ここが未開拓 |

### 1.2 closed-class vs open-class

- **closed-class**: 予約語・演算子・括弧・区切り（有限・構造を作る機能語）
- **open-class**: 識別子＝変数名・関数名（無限・意味を運ぶ）
- 初学者は両者を同じ重みで読もうとして固まる。「骨格を取るだけなら open-class の中身は無視してよい」を体得させる。
- **Monaco のシンタックスハイライトを教材化**する。「紫＝予約語（有限・構造）、別色＝自分でつけた名前（無限）」を色で説明できる（Monaco 採用の地味な利点）。

### 1.3 キーワードが括弧の意味を確定させる

`( )` と `{ }` は JS で多義。直前のキーワードが意味を確定させる。これが「手前（キーワード）から覚える」の教育的根拠。

- `( )`: グループ化 / 呼び出し / 引数定義 / アロー引数 / 条件 / for ヘッダ
- `{ }`: ブロック / オブジェクトリテラル / 分割代入 / 関数本体 / クラス本体
- 弁別の鍵: `if (`→条件、`function name(`→引数、`= {`→オブジェクト、`) {`→本体

### 1.4 段階設計（funnel：読む→いじる→埋める→書く）

| Stage | 名称 | 内容 | タイプ量 |
|---|---|---|---|
| `read` | 読む | Stage0。動くコードがある。「`5` を `10` に変えて Run」。図形が変わる。**触らせる（書かせない）** | ほぼゼロ |
| `tweak` | いじる | Parsons的並べ替え / 穴埋め。骨格は与えてピースを選ばせる。1.3 をここで体験 | 小 |
| `fill` | 埋める | 骨格 `function _(_) { return _ }` を見せて中身だけ書かせる | 中 |
| `write` | 書く | 白紙。ここまで来たのが「続く側」 | 大 |

最後に **組み込みメソッド練習帳 × 仕事文脈の総合問題** で着地。

---

## 2. TS の混ぜ込み

- **「TS」と名乗らず、型注釈を最初から自然に混ぜる**。「気づいたら TS 書けてた」を狙い、認知負荷を下げる。TS恐怖はブランディングの問題であり難易度の問題ではない。
- 注意: TS の「簡単な部分（注釈＝装飾）」と「価値がある＝難しい部分（narrowing / union / null / 外部データの any）」はズレている。仕事系の総合問題は後者を即座に引きずり込む（`querySelector()`→`Element | null`、`JSON.parse()`→`any`、シート行→`any[][]`）。
- **対策: モックを「型の難所を吸収する層」として使う**。集計問題のモックが `any[][]` ではなく `Sale[]` を返せば、外部データを型付けする苦行をスキップしつつ補完・型安全の旨味を得られる。
- **null チェック = narrowing** を「存在チェック」として 1.3 の `if ( )` 解読と地続きに刷り込む。出力スキーマ検証で「絞らないと結果が間違う」を**実行結果として**体験させる（型エラーとしてだけでなく）。
- モック生成は **`zod-v4-mocks`**（スキーマ一枚→型付きモック）を製造装置にする。教材の型がブレない。

---

## 3. 仕事文脈の総合問題（1エンジン + 4スキン）

実環境は用意せず**モックで擬似再現**。現実との乖離は許容（DOMメソッドを直接触らせる気はない）。

| スキン | シナリオ | モック化 | 距離・注意 |
|---|---|---|---|
| `data` | データエンジニアの集計 | `Sale[]` に map/filter/reduce | 最も正直。**総合問題の第一発はこれ** |
| `gas` | 事務員の GAS | `SpreadsheetApp...getRange()` のAPI表面をモック | 書くコードの形は本物。簡略版でよい |
| `email` | ビジネス職のメール自動化 | `sendEmail(to,subject,body)` を「送信済みパネル」に描画 | 実物（スケジューラ/認証/送信基盤）との距離大。「明日から動く」とは思わせない |
| `chrome` | 総合職の Chrome 拡張フォーム入力 | **自分が所有するサンドボックス「ページ」**に `querySelector().value=` | 実拡張との距離最大。**実在サイト自動化は ToS/bot検知の沼なので売らない。所有する箱の中だけ** |

**4スキンの骨格は同一**: `データを取る → 配列メソッドで変換 → 出力APIを叩く`。職種の皮が違うだけ。実装は **1エンジン + 4スキン（source / sink アダプタの差し替え）**。`input source → 学習者コード → output sink` の統一インターフェースを最初に切る。シナリオ追加 = 新規アダプタ1個。

### 3.1 組み込みメソッド練習帳

呼水なので **9割の仕事を回す8個程度に絞る**:
`map / filter / reduce / find / some・every / sort / includes / Object.entries` ＋ 文字列 `split / join / replace`。
`flatMap` `reduceRight` 等は出さない（スコープ規律）。

---

## 4. 実行・サンドボックス

- **エディタ: Monaco**。本物感＝呼水効果。内蔵 TS コンパイラで「①型診断（赤波線＝教える信号）」と「②TS→JS トランスパイル（実行用、`getTypeScriptWorker()` 経由で emit）」を両取り。
  - モバイル懸念には CodeMirror 6 という軽量選択肢もあるが、本物感を優先して Monaco で進める判断。
- **実行: Web Worker + タイムアウト強制終了**。初学者は必ず `while(true)` を書く。メインスレッドで固めると「壊れた」で終わるため Stage0 の前提条件。
- **コード差し替えは grep 置換ではなくスコープ注入**。ソースを正規表現で書き換えるのは誤爆の地雷。コードは一切書き換えず、モックに束縛された環境で学習者コードをそのまま走らせる:
  ```js
  new Function('document', 'sheet', learnerCode)(mockDocument, mockSheet)
  ```
  → これを Worker 内 + タイムアウトで包む。
- **出力は視覚的に**（canvas / DOM / 色）。`console.log` だけにしない（非エンジニアは何も感じない）。
- **エラー表示は赤波線で総攻撃しない**。出力 or アサーションで優しく ○×。

---

## 5. 採点

### 5.1 原則

- **ソース文字列を採点しない**（完全一致も grep も部分正解を拾えない）。**振る舞い（実行結果・最終状態）を採点**する → 部分正解が自然に出る。
- **振る舞いが合えば正解**。総合問題ではメソッドを縛らない（reduce 期待に for で正解 → 祝う）。
- 例外: **練習帳のみ** AST で「特定メソッドを呼んだか」を 1 チェックしてよい（そこは `.map` を使うこと自体が目的のため）。

### 5.2 採点エンジン（kind による dispatch）

- **io grader**（純粋関数系・data 等）: `input/expected` で照合。
  - **値の正しさ = 自前 `deepEqual`**（exact）
  - **形 = `outputSchema`（zod, 任意・教育用）**。「`Sale[]` の形か」「null を潰せたか」を先に優しく出す。**値の正しさは見ない**（形だけ合った誤答を通さないため値は deepEqual に任せる）。
- **state grader**（モック操作系・gas/email/chrome）: モックを注入して実行 → **最終状態・呼び出し記録**を deepEqual で照合。スパイは scope に同居。

### 5.3 値照合 deepEqual（matcher(zod生成) は廃止し一本化）

- `refine` は使わない。自前一致関数に一本化（順不同・浮動小数を同じ関数内で一貫処理できる）。
- `epsilon` 既定 **1e-9**。grader の呼び出し側で `{ epsilon: 1e-9, ...caseOpts }` を渡し、問題作者が指定し忘れても効くようにする。
- `unordered`、`Map` / `Set` / `Date` 対応。
- 既知の割り切り:
  - unordered / Set の貪欲マッチは理論上の取り違えリスクあり → **元データ設計で発生させない**ことで回避。
  - Map のオブジェクトキーは拾えない（プリミティブキー前提）→ そういう問題を作らない。

```ts
type EqOpts = { epsilon?: number; unordered?: boolean };

function deepEqual(a: unknown, b: unknown, o: EqOpts = {}): boolean {
  // 数値: epsilon 許容
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return o.epsilon != null ? Math.abs(a - b) <= o.epsilon : a === b;
  }
  // プリミティブ・null・undefined
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object")
    return Object.is(a, b);

  // 配列
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    if (o.unordered) {
      const used = new Array(b.length).fill(false);
      return a.every((av) => {
        const i = b.findIndex((bv, j) => !used[j] && deepEqual(av, bv, o));
        if (i === -1) return false;
        used[i] = true;
        return true;
      });
    }
    return a.every((av, i) => deepEqual(av, b[i], o));
  }
  if (Array.isArray(a) || Array.isArray(b)) return false;

  // Date
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof Date || b instanceof Date) return false;

  // Set（順不同が本質：多重集合マッチ）
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    const bs = [...b], used = new Array(bs.length).fill(false);
    return [...a].every((av) => {
      const i = bs.findIndex((bv, j) => !used[j] && deepEqual(av, bv, o));
      if (i === -1) return false;
      used[i] = true;
      return true;
    });
  }
  if (a instanceof Set || b instanceof Set) return false;

  // Map（キーは SameValueZero、値は再帰）
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, av] of a) {
      if (!b.has(k) || !deepEqual(av, b.get(k), o)) return false;
    }
    return true;
  }
  if (a instanceof Map || b instanceof Map) return false;

  // プレーンオブジェクト
  const ka = Object.keys(a as object), kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  return ka.every(
    (k) =>
      Object.prototype.hasOwnProperty.call(b, k) &&
      deepEqual((a as any)[k], (b as any)[k], o),
  );
}
```

### 5.4 採点フロー

1. io: `outputSchema?.safeParse(out)` で**形** → 通れば各ケース `deepEqual(out, expected, {epsilon:1e-9,...opts})` で**値**。
2. state: 学習者コードを Worker で実行 → 各 `asserts[].check(scope)`。
3. `success` 数で**部分点**。io は `error.issues[].path` から「3問目の total がズレてる」まで出せる。

---

## 6. 問題定義スキーマ

### 6.1 方針

- **問題定義は TS 変数一択**（YAML/JSON ではない）。理由: (1) テストケースに「式・述語」が入る、(2) `satisfies`/型補完が効く、(3) 文言・説明文の定数管理とテストケースを同一オブジェクトに同居できる。
- **DSL の実体 = Zod スキーマ一枚**。型・ランタイム検証・モック工場を兼ねる。新フォーマット言語は発明しない。
- **二層分割**:
  - **直列化可能コア**（`id / stage / scenario / copy / io cases`）→ JSON化・遅延ロード・i18n・Worker へ postMessage 可。
  - **コードコア**（モック工場・assert 述語・関数）→ バンドル内 TS 関数。problem id キーのレジストリ + 動的 import（ステージ単位）。
- **遅延ロード**で問題を分割、`copy` 等の軽量メタだけ先読み（呼水の初期ロードを守る）。定義が TS なのとバンドル戦略は別レイヤー、両立する。

### 6.2 codec の効きどころ（狙撃道具・バックボーンではない）

- `z.codec(入力, 出力, { decode, encode })`。`.decode()` = 前方（input→output）、`.encode()` = 後方。`.parse()` と `.decode()` はランタイム同一・型シグネチャのみ差。
- **重要制約**: `.transform()` は一方向なので encode で**ランタイム throw** する。
- **使う場所を限定**: 直列化境界をまたぐ**リッチ型の葉**（`Date` / `BigInt` / `Map` / `Set`）だけ。プレーン JSON（number / object配列）には不要。
- **ルール**: 保存 or Worker 送りする問題コア内で変換が要る箇所は、`.transform()` ではなく一律 `z.codec()` で書く。コードコア側（元々直列化しない）は何でもよい。

### 6.3 確定スキーマ

```ts
import { z } from "zod";

const Stage = z.enum(["read", "tweak", "fill", "write"]);
const Scenario = z.enum(["data", "gas", "email", "chrome"]);

// 軽量・直列化可能・i18n/遅延ロード対象
const Copy = z.object({
  title: z.string(),
  prompt: z.string(),                        // markdown
  hints: z.array(z.string()).default([]),
});

// io grader（純粋関数系）
const IoGrader = z.object({
  kind: z.literal("io"),
  entry: z.string().default("solve"),        // 呼ぶ関数名
  outputSchema: z.custom<z.ZodType>().optional(), // 形の検証（narrowing 体験）
  cases: z.array(z.object({
    input: z.array(z.unknown()),             // 引数として spread
    expected: z.unknown(),                   // 値：deepEqual で照合（リッチ型なら codec の葉）
    epsilon: z.number().optional(),
    unordered: z.boolean().optional(),
  })).min(1),
});

// state grader（モック操作系）
const StateGrader = z.object({
  kind: z.literal("state"),
  setupMocks: z.custom<() => Record<string, unknown>>(), // Worker に注入するモック工場
  asserts: z.array(z.object({
    label: z.string(),                       // ○×の行ラベル
    check: z.custom<(scope: Record<string, unknown>) => boolean>(),
  })).min(1),
});

const Grader = z.discriminatedUnion("kind", [IoGrader, StateGrader]);

const Problem = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  stage: Stage,
  scenario: Scenario,
  copy: Copy,
  initialCode: z.string(),                   // Monaco の初期コード（型注釈を最初から混ぜる）
  solutionCode: z.string(),                  // 模範解答（CI で満点検証に使用）
  grader: Grader,
});
type Problem = z.infer<typeof Problem>;

const defineProblem = (p: Problem) => Problem.parse(p); // 壊れた定義を起動時に弾く
```

### 6.4 コードコア・レジストリ

```ts
// graders/registry.ts（コードコア・バンドル内・遅延 import 対象）
export const graders: Record<
  string,
  () => Promise<{ setupMocks: () => Record<string, unknown>; asserts: unknown[] }>
> = {
  "sum-sales": () => import("./data/sum-sales"),
  "gas-fill-b2": () => import("./gas/fill-b2"),
};
```

### 6.5 スパイ（state 用・scope に同居）

```ts
function spy<F extends (...a: any[]) => any>(impl?: F) {
  const calls: any[][] = [];
  const fn = (...args: any[]) => { calls.push(args); return impl?.(...args); };
  return Object.assign(fn, { calls });
}

// setupMocks の戻り値
() => {
  const sendEmail = spy();
  return { sendEmail };                       // scope に同居 → check(scope) を一引数に保てる
};

// asserts[].check
(scope) =>
  deepEqual(scope.sendEmail.calls, [["a@example.com", "週次レポート", "..."]], { epsilon: 1e-9 });
```

→ io（値=deepEqual / 形=outputSchema）と state（最終状態・呼び出し記録=deepEqual）が**一個の deepEqual に集約**される。

---

## 7. テスト戦略（vitest）

**住み分け: vitest は「採点される側（問題セット・採点器）の品質保証」に使い、「採点の実行」には使わない。**

- **採点の実行には使わない**: vitest は本質的に Node のフレームワークで、browser mode もテストを小さな Vite アプリとしてブラウザに spawn し、オーケストレーションを担う Node プロセスに報告し返す構造。provider + ブラウザ起動が前提。Cloudflare Pages にデプロイした SPA の Worker 内・ユーザーのブラウザだけで完結する採点には乗らず、初期ロードも太る。
  - → **ランタイム採点は `outputSchema.safeParse` + 自前 `deepEqual` のまま**（Worker に積める唯一サイズの車輪）。
- **dev/CI でハマる**:
  1. **全問題の `solutionCode` が自分の grader で満点**を取ることをテスト → 「壊れた問題」を出荷前に機械検出（複数人で問題を量産する際の信頼性担保）。
     ```ts
     // problems.test.ts（dev/CI・Node・vitest）
     import { test, expect } from "vitest";
     import { allProblems } from "./problems";
     import { runGrader } from "./grader";

     test.each(allProblems)("$id: 模範解答が満点", async (p) => {
       const result = await runGrader(p, p.solutionCode);
       expect(result.passed).toBe(result.total);
     });
     ```
  2. **`deepEqual` のユニットテスト**（epsilon / unordered / Map / Set / Date の境界、`0.1+0.2`、空 Map、ネスト Set など）。採点の信頼性は土台なので最優先。

---

## 8. 道具立て（自前ライブラリの活用）

- **`zod-v4-mocks`**: 全モックの製造装置（スキーマ→型付きモック）。学習サイトの全モックを Zod スキーマ起点にし、ランタイム検証と型を両取り。
- **`zod`**: 問題定義スキーマ / 出力の形検証 / codec。

---

## 9. 未決事項（本書確定後に進める）

1. **`runGrader` 本体**（次の検討対象）: Worker 起動・コード注入・タイムアウト・`grader.kind` dispatch・結果集計。本書の部品（deepEqual 一本化 / spy / registry / kind union）が全部ここに集約される。
2. **TS 卒業ライン**: 「null チェックを自然に書ける」まで持っていくか、「注釈が読めて怖くない」で十分か。総合問題のモックが返す型のリッチさがこれで決まる。
3. io の `epsilon` / `unordered` は当面「元データ設計で発生回避 + 既定 epsilon=1e-9」で運用。境界が増えたら deepEqual を拡張。
