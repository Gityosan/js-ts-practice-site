import type { ProblemMeta } from "../core/schemas";

import sumNumbers from "./data/sum-numbers";
import filterEvens from "./data/filter-evens";
import mapDouble from "./data/map-double";
import sumSales from "./data/sum-sales";
import findProduct from "./data/find-product";
import somePositive from "./data/some-positive";
import sortNames from "./data/sort-names";
import entriesTax from "./data/entries-tax";
import splitCsv from "./data/split-csv";
import replaceTemplate from "./data/replace-template";
import gasSum from "./gas/sum-column";
import emailWeekly from "./email/weekly-report";
import starCount from "./read/star-count";
import average from "./data/average";

export const allProblems: ProblemMeta[] = [
  // read
  starCount,
  // fill / data（メソッド練習帳）
  sumNumbers,
  filterEvens,
  mapDouble,
  findProduct,
  somePositive,
  sortNames,
  entriesTax,
  splitCsv,
  replaceTemplate,
  // fill / 総合問題
  sumSales,
  // fill / gas
  gasSum,
  // fill / email
  emailWeekly,
  // write
  average,
];

export function getProblemById(id: string): ProblemMeta | undefined {
  return allProblems.find((p) => p.id === id);
}
