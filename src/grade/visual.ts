// 採点の「最終状態」を、scenario ごとの視覚出力に落とすための直列化可能モデル。
// Worker から postMessage で運ぶので、関数や非プレーン値を含めないこと（plain object のみ）。

export type EmailItem = { to: string; subject: string; body: string };
export type FormField = { label: string; value: string; filled: boolean };
export type Cell = { value: string | number; highlight?: boolean };

export type VisualState =
  | { kind: "emails"; sent: EmailItem[] } // email: 送信済みパネル
  | { kind: "form"; title?: string; fields: FormField[] } // chrome: サンドボックスのフォーム
  | { kind: "spreadsheet"; headers?: string[]; grid: Cell[][] } // gas: スプレッドシート
  | {
      kind: "table"; // data: 入力テーブル + 集計結果
      columns: string[];
      rows: (string | number)[][];
      result?: { label: string; value: string };
    };

/** spy.calls（[to, subject, body][]）→ 送信済みメール一覧 */
export function callsToEmails(calls: unknown[][]): VisualState {
  const sent: EmailItem[] = calls.map((args) => ({
    to: String(args[0] ?? ""),
    subject: String(args[1] ?? ""),
    body: String(args[2] ?? ""),
  }));
  return { kind: "emails", sent };
}

/** オブジェクト配列 → data テーブル（先頭行のキーを列に） */
export function objectsToTable(
  rows: Record<string, unknown>[],
  result?: { label: string; value: unknown },
): VisualState {
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  const body = rows.map((r) =>
    columns.map((c) => {
      const v = r[c];
      return typeof v === "number" ? v : String(v);
    }),
  );
  return {
    kind: "table",
    columns,
    rows: body,
    result: result ? { label: result.label, value: formatValue(result.value) } : undefined,
  };
}

/** 配列（オブジェクト配列 / プリミティブ配列）を良きに計らってテーブル化 */
export function autoTable(
  arr: unknown,
  result?: { label: string; value: unknown },
): VisualState {
  const rows = Array.isArray(arr) ? arr : [arr];
  const first = rows[0];
  if (first && typeof first === "object" && !Array.isArray(first)) {
    return objectsToTable(rows as Record<string, unknown>[], result);
  }
  return {
    kind: "table",
    columns: ["値"],
    rows: rows.map((v) => [typeof v === "number" ? v : String(v)]),
    result: result ? { label: result.label, value: formatValue(result.value) } : undefined,
  };
}

function formatValue(v: unknown): string {
  if (typeof v === "number") return v.toLocaleString("ja-JP");
  if (Array.isArray(v)) return `[${v.map(formatValue).join(", ")}]`;
  if (v && typeof v === "object") return JSON.stringify(v);
  return String(v);
}
