import { test, expect } from "vitest";
import { friendly } from "../grade/friendly";
import { beginnerMistakes } from "../grade/errors.fixtures";

test.each(beginnerMistakes)("$id: 生エラーを捕まえ優しい対訳がある", ({ code }) => {
  let raw: unknown;
  try {
    new Function(code)();
  } catch (e) {
    raw = e;
  }
  expect(raw, "エラーを投げる想定").toBeDefined();
  const f = friendly(raw);
  expect(f.matched, `未対訳: ${(raw as Error)?.message}`).toBe(true);
});
