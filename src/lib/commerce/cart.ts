import { products } from "@/data/products";

export type CartLineInput = {
  sku: string;
  quantity: number;
};

export function priceCart(lines: CartLineInput[]) {
  const productRows = products.flatMap((product) => [
    { sku: product.sku, name: product.name, priceCents: product.priceCents },
    ...(product.variants ?? []).map((variant) => ({
      sku: variant.sku,
      name: `${product.name} - ${variant.name}`,
      priceCents: variant.priceCents
    }))
  ]);

  const items = lines.map((line) => {
    const row = productRows.find((product) => product.sku === line.sku);
    if (!row) throw new Error(`Unknown SKU: ${line.sku}`);
    if (row.priceCents <= 0) throw new Error(`${row.name} is coming soon`);

    const quantity = Math.max(1, Math.min(99, Math.floor(line.quantity)));
    return {
      ...row,
      quantity,
      lineTotalCents: row.priceCents * quantity
    };
  });

  return {
    items,
    subtotalCents: items.reduce((sum, item) => sum + item.lineTotalCents, 0)
  };
}
