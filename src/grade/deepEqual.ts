export type EqOpts = { epsilon?: number; unordered?: boolean };

export function deepEqual(a: unknown, b: unknown, o: EqOpts = {}): boolean {
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return o.epsilon != null ? Math.abs(a - b) <= o.epsilon : a === b;
  }
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object")
    return Object.is(a, b);

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    if (o.unordered) {
      const used = Array.from({ length: b.length }, () => false);
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

  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof Date || b instanceof Date) return false;

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    const bs = [...b],
      used = Array.from({ length: bs.length }, () => false);
    return [...a].every((av) => {
      const i = bs.findIndex((bv, j) => !used[j] && deepEqual(av, bv, o));
      if (i === -1) return false;
      used[i] = true;
      return true;
    });
  }
  if (a instanceof Set || b instanceof Set) return false;

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, av] of a) {
      if (!b.has(k) || !deepEqual(av, b.get(k), o)) return false;
    }
    return true;
  }
  if (a instanceof Map || b instanceof Map) return false;

  const ka = Object.keys(a as object),
    kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  return ka.every(
    (k) =>
      Object.prototype.hasOwnProperty.call(b, k) &&
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], o),
  );
}
