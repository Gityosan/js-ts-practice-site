const KEY = "jsts_solved";

function getSolvedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function markSolved(id: string): void {
  const set = getSolvedSet();
  set.add(id);
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    // localStorage unavailable (SSR / private mode)
  }
}

export function isSolved(id: string): boolean {
  return getSolvedSet().has(id);
}

export function getAllSolved(): Set<string> {
  return getSolvedSet();
}
