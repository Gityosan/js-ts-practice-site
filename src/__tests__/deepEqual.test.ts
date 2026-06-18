import { describe, it, expect } from "vitest";
import { deepEqual } from "../grade/deepEqual";

describe("deepEqual", () => {
  describe("プリミティブ", () => {
    it("同じ数値", () => expect(deepEqual(1, 1)).toBe(true));
    it("異なる数値", () => expect(deepEqual(1, 2)).toBe(false));
    it("NaN同士", () => expect(deepEqual(NaN, NaN)).toBe(true));
    it("null同士", () => expect(deepEqual(null, null)).toBe(true));
    it("null vs undefined", () => expect(deepEqual(null, undefined)).toBe(false));
    it("文字列", () => expect(deepEqual("a", "a")).toBe(true));
    it("真偽値", () => expect(deepEqual(true, false)).toBe(false));
  });

  describe("epsilon（浮動小数）", () => {
    it("0.1+0.2 ≈ 0.3", () => expect(deepEqual(0.1 + 0.2, 0.3, { epsilon: 1e-9 })).toBe(true));
    it("許容範囲外", () => expect(deepEqual(0.1 + 0.2, 0.4, { epsilon: 1e-9 })).toBe(false));
    it("epsilonなしは厳密比較", () => expect(deepEqual(0.1 + 0.2, 0.3)).toBe(false));
  });

  describe("配列", () => {
    it("同じ配列", () => expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true));
    it("長さ違い", () => expect(deepEqual([1, 2], [1, 2, 3])).toBe(false));
    it("空配列", () => expect(deepEqual([], [])).toBe(true));
    it("ネスト配列", () => expect(deepEqual([[1, 2], [3]], [[1, 2], [3]])).toBe(true));
  });

  describe("unordered", () => {
    it("順不同で一致", () =>
      expect(deepEqual([3, 1, 2], [1, 2, 3], { unordered: true })).toBe(true));
    it("順不同で不一致", () =>
      expect(deepEqual([1, 2, 3], [1, 2, 4], { unordered: true })).toBe(false));
    it("重複要素", () => expect(deepEqual([1, 1, 2], [1, 2, 1], { unordered: true })).toBe(true));
  });

  describe("Date", () => {
    it("同じ日時", () =>
      expect(deepEqual(new Date("2024-01-01"), new Date("2024-01-01"))).toBe(true));
    it("異なる日時", () =>
      expect(deepEqual(new Date("2024-01-01"), new Date("2024-01-02"))).toBe(false));
  });

  describe("Set", () => {
    it("同じ Set", () => expect(deepEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true));
    it("サイズ違い", () => expect(deepEqual(new Set([1, 2]), new Set([1, 2, 3]))).toBe(false));
    it("空 Set", () => expect(deepEqual(new Set(), new Set())).toBe(true));
  });

  describe("Map", () => {
    it("同じ Map", () => expect(deepEqual(new Map([["a", 1]]), new Map([["a", 1]]))).toBe(true));
    it("値が違う", () => expect(deepEqual(new Map([["a", 1]]), new Map([["a", 2]]))).toBe(false));
    it("空 Map", () => expect(deepEqual(new Map(), new Map())).toBe(true));
  });

  describe("オブジェクト", () => {
    it("同じオブジェクト", () => expect(deepEqual({ a: 1, b: "x" }, { a: 1, b: "x" })).toBe(true));
    it("値が違う", () => expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false));
    it("キー数違い", () => expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false));
    it("ネストオブジェクト", () => expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true));
  });
});
