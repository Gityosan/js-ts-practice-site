import type { ProblemMeta } from "../core/schemas";

import decodeConstName from "./decode/const-name";
import decodeFunctionShape from "./decode/function-shape";
import decodeIfCondition from "./decode/if-condition";
import decodeObjectVsBlock from "./decode/object-vs-block";
import decodeArrayBrackets from "./decode/array-brackets";
import decodeForLoop from "./decode/for-loop";
import decodeMethodChain from "./decode/method-chain";
import decodeOperators from "./decode/operators";
import learnArithmetic from "./learn/arithmetic";
import learnComparison from "./learn/comparison";
import learnVariables from "./learn/variables";
import learnStringConvert from "./learn/string-convert";
import learnBoolean from "./learn/boolean";
import learnFunctions from "./learn/functions";
import learnAsyncAwait from "./learn/async-await";
import learnPromiseChain from "./learn/promise-chain";
import learnClass from "./learn/class";
import learnTypes from "./learn/types";
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
import chromeFillForm from "./chrome/fill-form";
import chromeGetText from "./chrome/get-text";
import gasConditionalSum from "./gas/conditional-sum";
import gasRowsToObj from "./gas/rows-to-obj";
import emailPersonalized from "./email/personalized-send";
import emailMakeSubject from "./email/make-subject";
import jqPickNames from "./jq/pick-names";
import jqSelectAdults from "./jq/select-adults";
import jqCountUsers from "./jq/count-users";
import jqSumPrices from "./jq/sum-prices";
import jqUniqueTags from "./jq/unique-tags";
import jqMapShape from "./jq/map-shape";
import jqGroupRegion from "./jq/group-region";
import jqSortByAge from "./jq/sort-by-age";
import jqKeys from "./jq/keys";
import jqMaxByPrice from "./jq/max-by-price";
import jqJoinNames from "./jq/join-names";
import jqInterpolate from "./jq/interpolate";
import jqAllAdults from "./jq/all-adults";
import jqDefaultNick from "./jq/default-nick";
import jqFlatten from "./jq/flatten";
import shGreetLoop from "./sh/greet-loop";
import shSumLoop from "./sh/sum-loop";
import shEvenOdd from "./sh/even-odd";
import shLineCount from "./sh/line-count";
import shUppercase from "./sh/uppercase";
import shStrLength from "./sh/str-length";

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
  // learn（知る）— 文法のキホン
  learnArithmetic,
  learnComparison,
  learnVariables,
  learnStringConvert,
  learnBoolean,
  learnFunctions,
  learnAsyncAwait,
  learnPromiseChain,
  learnClass,
  learnTypes,
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
  // bash: jq（CLI）
  jqPickNames,
  jqSelectAdults,
  jqCountUsers,
  jqSumPrices,
  jqUniqueTags,
  jqMapShape,
  jqGroupRegion,
  jqSortByAge,
  jqKeys,
  jqMaxByPrice,
  jqJoinNames,
  jqInterpolate,
  jqAllAdults,
  jqDefaultNick,
  jqFlatten,
  // bash: シェルスクリプト（本物の bash / WASM）
  shGreetLoop,
  shSumLoop,
  shEvenOdd,
  shLineCount,
  shUppercase,
  shStrLength,
];

export function getProblemById(id: string): ProblemMeta | undefined {
  return allProblems.find((p) => p.id === id);
}
