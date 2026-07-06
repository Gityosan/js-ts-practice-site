import { describe, it, expect } from "vitest";
import { runGrader } from "../core/grader-node";

// jq（cli グレーダー）が本物の jq で採点し、正誤を切り分けられることを確認する。
describe("jq グレーダー: bash-jq-pick-names", () => {
  it("模範解答 .users[].name は満点", async () => {
    const r = await runGrader("bash-jq-pick-names", ".users[].name");
    expect(r.passed).toBe(r.total);
    expect(r.total).toBeGreaterThan(0);
  });

  it("配列のまま出す .users は不正解（名前に展開していない）", async () => {
    const r = await runGrader("bash-jq-pick-names", ".users");
    expect(r.passed).toBeLessThan(r.total);
  });

  it("構文エラーのフィルタは落ちる（例外にせず不正解として扱う）", async () => {
    const r = await runGrader("bash-jq-pick-names", ".users[.");
    expect(r.status).toBe("ok");
    expect(r.passed).toBe(0);
  });
});
