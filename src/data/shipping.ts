import { getCountry } from "@/data/countries";

// Flat USD rates from the live Sicon Art shipping-zones table, converted from
// "Copy of shipping fee.xlsx" (RMB/kg) via ceil(RMB / 7.25) + 1.
const SHIPPING_RATES_CENTS: Record<string, number> = {
  VN: 500,
  TW: 800,
  TH: 800,
  JP: 800,
  SG: 800,
  MY: 800,
  KR: 1000,
  GB: 1100,
  RU: 1100,
  US: 1100,
  PH: 1200,
  DE: 1200,
  BY: 1200,
  NL: 1300,
  PL: 1300,
  AU: 1300,
  MX: 1400,
  ID: 1500,
  ES: 1500,
  PT: 1500,
  BE: 1600,
  FR: 1700,
  IT: 1700,
  SE: 1700,
  DK: 1700,
  GR: 1700,
  AT: 1700,
  FI: 1800,
  TR: 1900,
  NO: 1900,
  IN: 2000,
  CH: 2000,
  CA: 2200,
  ZA: 2200,
  NZ: 2400,
  BR: 2700,
  GE: 2800,
  AR: 3200,
  AZ: 4900
};

export type ShippingQuote =
  | { available: true; cents: number; countryCode: string; countryName: string }
  | { available: false; countryCode: string; countryName: string };

export function getShippingQuote(countryCode: string): ShippingQuote | null {
  const country = getCountry(countryCode);
  if (!country) return null;
  const cents = SHIPPING_RATES_CENTS[country.code];
  if (typeof cents === "number") {
    return { available: true, cents, countryCode: country.code, countryName: country.name };
  }
  return { available: false, countryCode: country.code, countryName: country.name };
}

export function hasAutomaticShipping(countryCode: string) {
  return Boolean(SHIPPING_RATES_CENTS[countryCode.toUpperCase()]);
}
