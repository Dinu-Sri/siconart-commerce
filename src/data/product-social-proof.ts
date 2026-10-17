const SOLD_STEPS = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500] as const;
const RATINGS = [4.7, 4.8, 4.8, 4.9, 4.9, 5] as const;

function skuSeed(sku: string) {
  let hash = 0;
  for (const char of sku) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return hash;
}

export function productSocialProof(sku: string) {
  const seed = skuSeed(sku);
  const sold = SOLD_STEPS[seed % SOLD_STEPS.length];
  const rating = RATINGS[seed % RATINGS.length];
  return { rating, sold };
}
