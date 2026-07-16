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
import shGreetLoop from "./sh/greet-loop";
import jqLength from "./jq/length";
import jqFirstUserName from "./jq/first-user-name";
import jqSumAges from "./jq/sum-ages";
import jqFilterAdult from "./jq/filter-adult";
import jqMapDouble from "./jq/map-double";
import jqKeys from "./jq/keys";
import jqHasKey from "./jq/has-key";
import jqSortByAge from "./jq/sort-by-age";
import jqMaxByAge from "./jq/max-by-age";
import jqUniqueValues from "./jq/unique-values";
import jqGroupCount from "./jq/group-count";
import jqToEntries from "./jq/to-entries";
import jqStringInterp from "./jq/string-interp";
import jqIfThenElse from "./jq/if-then-else";
import jqSelectAnd from "./jq/select-and";
import jqNestedPath from "./jq/nested-path";
import jqArrayConstruct from "./jq/array-construct";
import jqAltOperator from "./jq/alt-operator";
import jqJoin from "./jq/join";
import shIfEvenOdd from "./sh/if-even-odd";
import shSumTwo from "./sh/sum-two";
import shCountDown from "./sh/count-down";
import shStringUpper from "./sh/string-upper";
import shStringLength from "./sh/string-length";
import shArraySum from "./sh/array-sum";
import shMaxOfThree from "./sh/max-of-three";
import shFizzbuzz from "./sh/fizzbuzz";
import shReverseString from "./sh/reverse-string";
import shFunctionGreet from "./sh/function-greet";
import shWhileReadLines from "./sh/while-read-lines";
import shCaseDay from "./sh/case-day";
import shDefaultValue from "./sh/default-value";
import shSubstring from "./sh/substring";
import shStringReplace from "./sh/string-replace";
import shPositionalParams from "./sh/positional-params";
import shNestedLoop from "./sh/nested-loop";
import shArrayFilter from "./sh/array-filter";
import shHereString from "./sh/here-string";

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
  jqLength,
  jqFirstUserName,
  jqSumAges,
  jqFilterAdult,
  jqMapDouble,
  jqKeys,
  jqHasKey,
  jqSortByAge,
  jqMaxByAge,
  jqUniqueValues,
  jqGroupCount,
  jqToEntries,
  jqStringInterp,
  jqIfThenElse,
  jqSelectAnd,
  jqNestedPath,
  jqArrayConstruct,
  jqAltOperator,
  jqJoin,
  // bash: シェルスクリプト（本物の bash / WASM）
  shGreetLoop,
  shIfEvenOdd,
  shSumTwo,
  shCountDown,
  shStringUpper,
  shStringLength,
  shArraySum,
  shMaxOfThree,
  shFizzbuzz,
  shReverseString,
  shFunctionGreet,
  shWhileReadLines,
  shCaseDay,
  shDefaultValue,
  shSubstring,
  shStringReplace,
  shPositionalParams,
  shNestedLoop,
  shArrayFilter,
  shHereString,
];

export function getProblemById(id: string): ProblemMeta | undefined {
  return allProblems.find((p) => p.id === id);
}
