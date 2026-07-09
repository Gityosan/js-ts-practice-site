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
  // bash / jq
  "bash-jq-pick-names": () => import("./jq/pick-names").then((m) => m.default),
  "bash-jq-select-adults": () => import("./jq/select-adults").then((m) => m.default),
  "bash-jq-count": () => import("./jq/count-users").then((m) => m.default),
  "bash-jq-sum-prices": () => import("./jq/sum-prices").then((m) => m.default),
  "bash-jq-unique-tags": () => import("./jq/unique-tags").then((m) => m.default),
  "bash-jq-map-shape": () => import("./jq/map-shape").then((m) => m.default),
  "bash-jq-group-region": () => import("./jq/group-region").then((m) => m.default),
  "bash-jq-sort-by-age": () => import("./jq/sort-by-age").then((m) => m.default),
  "bash-jq-keys": () => import("./jq/keys").then((m) => m.default),
  "bash-jq-max-by-price": () => import("./jq/max-by-price").then((m) => m.default),
  "bash-jq-join-names": () => import("./jq/join-names").then((m) => m.default),
  "bash-jq-interpolate": () => import("./jq/interpolate").then((m) => m.default),
  "bash-jq-all-adults": () => import("./jq/all-adults").then((m) => m.default),
  "bash-jq-default-nick": () => import("./jq/default-nick").then((m) => m.default),
  "bash-jq-flatten": () => import("./jq/flatten").then((m) => m.default),
  // bash / シェル（本物の bash / WASM）
  "bash-sh-greet-loop": () => import("./sh/greet-loop").then((m) => m.default),
  "bash-sh-sum-loop": () => import("./sh/sum-loop").then((m) => m.default),
  "bash-sh-even-odd": () => import("./sh/even-odd").then((m) => m.default),
  "bash-sh-line-count": () => import("./sh/line-count").then((m) => m.default),
  "bash-sh-uppercase": () => import("./sh/uppercase").then((m) => m.default),
  "bash-sh-str-length": () => import("./sh/str-length").then((m) => m.default),
};
