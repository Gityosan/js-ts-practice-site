import type { ProblemMeta } from "../core/schemas";
import sumNumbers from "./data/sum-numbers";
import filterEvens from "./data/filter-evens";
import mapDouble from "./data/map-double";
import sumSales from "./data/sum-sales";

export const allProblems: ProblemMeta[] = [sumNumbers, filterEvens, mapDouble, sumSales];

export function getProblemById(id: string): ProblemMeta | undefined {
  return allProblems.find((p) => p.id === id);
}
