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
  // fill / gas
  "fill-gas-sum-column": () => import("./gas/sum-column").then((m) => m.default),
  // fill / email
  "fill-email-weekly": () => import("./email/weekly-report").then((m) => m.default),
  // read
  "read-star-count": () => import("./read/star-count").then((m) => m.default),
  // write
  "write-average": () => import("./data/average").then((m) => m.default),
};
