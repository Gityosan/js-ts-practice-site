import type { RustExecutor } from "./rust";

// ブラウザ用の実行器: 公式の Rust Playground（https://play.rust-lang.org）でコンパイル・実行する。
// Playground の API は CORS を許可している（Access-Control-Allow-Origin: *）ので、
// 静的サイト（GitHub Pages）から直接呼べる。COEP 下でも CORS 応答なので読み取れる。
//
// 制約:
// - ネットワークが必要。オフラインでは採点できない（分かりやすいメッセージで落とす）。
// - 標準入力は渡せない。採点は関数呼び出し（harness）か標準出力（stdout）で行う。
// - 外部クレートは Playground が用意している人気クレート（rand 等）のみ。教材では std だけを使う。

const PLAYGROUND_URL = "https://play.rust-lang.org/execute";
const REQUEST_TIMEOUT_MS = 45000;

type PlaygroundResponse = {
  success: boolean;
  exitDetail?: string;
  stdout: string;
  stderr: string;
  error?: string;
};

export const playgroundExecutor: RustExecutor = async (program) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(PLAYGROUND_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        channel: "stable",
        mode: "debug",
        edition: "2024",
        crateType: "bin",
        tests: false,
        backtrace: false,
        code: program,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(
        `Rust Playground がエラーを返しました（HTTP ${res.status}）。少し待ってからもう一度試してください。`,
      );
    }
    const data = (await res.json()) as PlaygroundResponse;
    if (data.error) throw new Error(`Rust Playground: ${data.error}`);
    // コンパイル失敗は stderr に "error[E....]" / "error:" が出て、実行は行われない
    const compileError =
      !data.success &&
      /(^|\n)error(\[E\d{4}\])?:/.test(data.stderr) &&
      !/Running `/.test(data.stderr);
    return { success: data.success, compileError, stdout: data.stdout, stderr: data.stderr };
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      throw new Error("時間切れ（無限ループになっていないか確認しましょう）");
    }
    if (e instanceof TypeError) {
      throw new Error(
        "Rust Playground に接続できませんでした。ネットワーク接続を確認してください。",
      );
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
};
