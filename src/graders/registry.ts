import type { GraderDef } from "../grade/types";

export const graders: Record<string, () => Promise<GraderDef>> = {
  // fill / data
  "fill-sum-numbers": () => import("./data/sum-numbers").then((m) => m.default),
  "fill-filter-evens": () => import("./data/filter-evens").then((m) => m.default),
  "fill-map-double": () => import("./data/map-double").then((m) => m.default),
  "fill-sum-sales": () => import("./data/sum-sales").then((m) => m.default),
  "fill-find-product": () => import("./data/find-product").then((m) => m.default),
  "fill-some-positive": () => import("./data/some-positive").then((m) => m.default),
  "fill-sort-names": () => import("./data/sort-names").then((m) => m.default),
  "fill-entries-tax": () => import("./data/entries-tax").then((m) => m.default),
  "fill-split-csv": () => import("./data/split-csv").then((m) => m.default),
  "fill-replace-template": () => import("./data/replace-template").then((m) => m.default),
  // tweak
  "tweak-keyword-sum": () => import("./tweak/keyword-sum").then((m) => m.default),
  "tweak-parsons-filter": () => import("./tweak/parsons-filter").then((m) => m.default),
  "tweak-method-double": () => import("./tweak/method-double").then((m) => m.default),
  "tweak-gas-parsons": () => import("./tweak/gas-parsons").then((m) => m.default),
  "tweak-email-choice": () => import("./tweak/email-choice").then((m) => m.default),
  "tweak-chrome-choice": () => import("./tweak/chrome-choice").then((m) => m.default),
  // fill / gas
  "fill-gas-sum-column": () => import("./gas/sum-column").then((m) => m.default),
  "fill-gas-conditional-sum": () => import("./gas/conditional-sum").then((m) => m.default),
  // fill / email
  "fill-email-weekly": () => import("./email/weekly-report").then((m) => m.default),
  "fill-email-personalized": () => import("./email/personalized-send").then((m) => m.default),
  // fill / chrome
  "fill-chrome-fill-form": () => import("./chrome/fill-form").then((m) => m.default),
  "fill-chrome-get-text": () => import("./chrome/get-text").then((m) => m.default),
  // read
  "read-star-count": () => import("./read/star-count").then((m) => m.default),
  "read-greeting": () => import("./read/greeting").then((m) => m.default),
  "read-progress": () => import("./read/progress").then((m) => m.default),
  "read-color-box": () => import("./read/color-box").then((m) => m.default),
  "read-bool-light": () => import("./read/bool-light").then((m) => m.default),
  // write
  "write-average": () => import("./data/average").then((m) => m.default),
  "write-max-value": () => import("./data/max-value").then((m) => m.default),
  "write-unique": () => import("./data/unique").then((m) => m.default),
  "write-group-sum": () => import("./data/group-sum").then((m) => m.default),
  "write-gas-rows-to-obj": () => import("./gas/rows-to-obj").then((m) => m.default),
  "write-email-make-subject": () => import("./email/make-subject").then((m) => m.default),
};
