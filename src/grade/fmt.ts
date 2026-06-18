export function fmt(v: unknown, maxLen = 60): string {
  if (v === undefined) return "undefined";
  try {
    const s = JSON.stringify(v);
    return s.length <= maxLen ? s : s.slice(0, maxLen - 1) + "…";
  } catch {
    return String(v);
  }
}
