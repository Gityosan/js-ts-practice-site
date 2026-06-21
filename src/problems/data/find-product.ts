import { z } from "zod";
import { defineProblem } from "../../core/schemas";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().min(0),
});
export type Product = z.infer<typeof ProductSchema>;

export default defineProblem({
  id: "fill-find-product",
  stage: "fill",
  scenario: "data",
  copy: {
    title: "ID で探そう",
    prompt: `## やること

商品リストから、指定した \`id\` の商品を探して返す関数 \`solve\` を完成させよう。
見つからなければ \`undefined\` を返す。

\`\`\`ts
const products = [
  { id: "p1", name: "コーヒー", price: 500 },
  { id: "p2", name: "紅茶",     price: 400 },
];
solve(products, "p2") // → { id: "p2", name: "紅茶", price: 400 }
solve(products, "p9") // → undefined
\`\`\`

## ヒント: find の骨格

\`\`\`
配列.find( 要素 => 条件 )
       ^^^^   ^^^^    ^^^^
       呼び出し 引数   true/false を返す式
\`\`\`

\`find\` は条件が \`true\` になった**最初の要素**を返す。`,
    hints: [
      "`products.find(p => p.id === id)` — p は各商品オブジェクト",
      "条件が一致する商品がなければ `find` は `undefined` を返す（何も書かなくてよい）",
      "アロー関数 `p => p.id === id` は「p.id が引数 id と等しいか」を意味する",
    ],
  },
  initialCode: `type Product = { id: string; name: string; price: number };

function solve(products: Product[], id: string): Product | undefined {
  // ここに書こう

}`,
  solutionCode: `type Product = { id: string; name: string; price: number };

function solve(products: Product[], id: string): Product | undefined {
  return products.find(p => p.id === id);
}`,
});
