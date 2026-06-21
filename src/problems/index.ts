import type { ProblemMeta } from "../core/schemas";

import decodeConstName from "./decode/const-name";
import decodeFunctionShape from "./decode/function-shape";
import decodeIfCondition from "./decode/if-condition";
import decodeObjectVsBlock from "./decode/object-vs-block";
import decodeArrayBrackets from "./decode/array-brackets";
import decodeForLoop from "./decode/for-loop";
import decodeMethodChain from "./decode/method-chain";
import decodeOperators from "./decode/operators";
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
import readGreeting from "./read/greeting";
import readProgress from "./read/progress";
import readColorBox from "./read/color-box";
import readBoolLight from "./read/bool-light";
import average from "./data/average";
import maxValue from "./data/max-value";
import unique from "./data/unique";
import groupSum from "./data/group-sum";
import tweakKeywordSum from "./tweak/keyword-sum";
import tweakParsonsFilter from "./tweak/parsons-filter";
import tweakMethodDouble from "./tweak/method-double";
import tweakGasParsons from "./tweak/gas-parsons";
import tweakEmailChoice from "./tweak/email-choice";
import tweakChromeChoice from "./tweak/chrome-choice";
import chromeFillForm from "./chrome/fill-form";
import chromeGetText from "./chrome/get-text";
import gasConditionalSum from "./gas/conditional-sum";
import gasRowsToObj from "./gas/rows-to-obj";
import emailPersonalized from "./email/personalized-send";
import emailMakeSubject from "./email/make-subject";

export const allProblems: ProblemMeta[] = [
  // decode（解読）
  decodeConstName,
  decodeFunctionShape,
  decodeIfCondition,
  decodeObjectVsBlock,
  decodeArrayBrackets,
  decodeForLoop,
  decodeMethodChain,
  decodeOperators,
  // read
  starCount,
  readGreeting,
  readProgress,
  readColorBox,
  readBoolLight,
  // tweak（choice → parsons の順、種類ごとにまとめる）
  tweakKeywordSum,
  tweakMethodDouble,
  tweakEmailChoice,
  tweakChromeChoice,
  tweakParsonsFilter,
  tweakGasParsons,
  // fill: 合計を計算する①〜④
  sumNumbers,
  entriesTax,
  gasSum,
  gasConditionalSum,
  // fill: その他のデータ操作
  mapDouble,
  filterEvens,
  somePositive,
  sortNames,
  findProduct,
  splitCsv,
  replaceTemplate,
  sumSales,
  // fill: メールを送る①②
  emailWeekly,
  emailPersonalized,
  // fill: 要素操作
  chromeFillForm,
  chromeGetText,
  // write
  average,
  maxValue,
  unique,
  groupSum,
  gasRowsToObj,
  emailMakeSubject,
];

export function getProblemById(id: string): ProblemMeta | undefined {
  return allProblems.find((p) => p.id === id);
}
