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
import tweakKeywordSum from "./tweak/keyword-sum";
import tweakParsonsFilter from "./tweak/parsons-filter";
import tweakMethodDouble from "./tweak/method-double";
import tweakGasParsons from "./tweak/gas-parsons";
import tweakEmailChoice from "./tweak/email-choice";
import chromeFillForm from "./chrome/fill-form";

export const allProblems: ProblemMeta[] = [
  // read
  starCount,
  // tweak
  tweakKeywordSum,
  tweakParsonsFilter,
  tweakMethodDouble,
  tweakGasParsons,
  tweakEmailChoice,
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
  // fill / chrome
  chromeFillForm,
  // write
  average,
];

export function getProblemById(id: string): ProblemMeta | undefined {
  return allProblems.find((p) => p.id === id);
}
