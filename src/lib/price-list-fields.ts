export const priceListValueFields = [
  "retail",
  "artist",
  "miniWholesale",
  "miniWholesaleMoq",
  "bulkWholesale",
  "bulkWholesaleMoq"
] as const;

export type PriceListValueField = (typeof priceListValueFields)[number];

export type PriceListOverride = Partial<Record<PriceListValueField, number>>;

export type PriceListFieldUpdate = {
  sku: string;
  field: PriceListValueField;
  value: number;
};

export function isPriceListValueField(value: string): value is PriceListValueField {
  return (priceListValueFields as readonly string[]).includes(value);
}
