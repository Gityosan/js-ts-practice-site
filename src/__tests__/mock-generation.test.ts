// zod-v4-mocks の使用例（Node.js専用・ブラウザバンドル非対応）
// initGenerator でスキーマ→型付きモックを生成し、テストデータの形を保証する
import { describe, it, expect } from "vitest";
import { initGenerator } from "zod-v4-mocks";
import { SaleSchema } from "../problems/data/sum-sales";

const gen = initGenerator({ seed: 42 });

describe("zod-v4-mocks: スキーマからモック生成", () => {
  it("SaleSchema から型付きモックが生成できる", () => {
    const mock = gen.generate(SaleSchema);
    // 生成されたモックが SaleSchema を満たすか検証
    expect(SaleSchema.parse(mock)).toBeDefined();
    expect(typeof mock.id).toBe("string");
    expect(typeof mock.region).toBe("string");
    expect(typeof mock.amount).toBe("number");
    expect(mock.amount).toBeGreaterThanOrEqual(1);
    expect(mock.amount).toBeLessThanOrEqual(10000);
  });

  it("シード固定で同じデータが生成される", () => {
    const gen1 = initGenerator({ seed: 1 });
    const gen2 = initGenerator({ seed: 1 });
    const m1 = gen1.generate(SaleSchema);
    const m2 = gen2.generate(SaleSchema);
    expect(m1).toEqual(m2);
  });
});
