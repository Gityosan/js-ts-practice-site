import type { GraderDef } from "../grade/types";

export const graders: Record<string, () => Promise<GraderDef>> = {
  "fill-sum-numbers": () => import("./data/sum-numbers").then((m) => m.default),
  "fill-filter-evens": () => import("./data/filter-evens").then((m) => m.default),
  "fill-map-double": () => import("./data/map-double").then((m) => m.default),
  "fill-sum-sales": () => import("./data/sum-sales").then((m) => m.default),
};
