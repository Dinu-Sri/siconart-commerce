import type { Metadata } from "next";
import Script from "next/script";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCountry } from "@/data/countries";
import { CheckoutView, type CheckoutPrefill } from "@/components/commerce/checkout-view";
import { getStorefrontProducts } from "@/lib/commerce/live-prices";
import { getAccountSnapshot } from "@/lib/customer-account";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const catalog = await getStorefrontProducts();
  const prefill = await loadCheckoutPrefill();

  return (
    <section className="container-content section-pad">
      <Script src="https://www.payhere.lk/lib/payhere.js" strategy="afterInteractive" data-payhere-sdk="true" />
      <CheckoutView locale={activeLocale} catalog={catalog} prefill={prefill} />
    </section>
  );
}

async function loadCheckoutPrefill(): Promise<CheckoutPrefill | undefined> {
  try {
    const account = await getAccountSnapshot();
    if (!account) return undefined;
    const address = account.addresses.find((item) => item.isDefault) || account.addresses[0];
    const country = address?.countryCode ? getCountry(address.countryCode) : undefined;
    const parts = (address?.name || account.customer.name || "").trim().split(/\s+/).filter(Boolean);
    return {
      email: account.customer.email,
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" "),
      countryCode: address?.countryCode || "",
      phoneNational: nationalPhone(address?.phone || account.customer.phone || "", country?.dial),
      line1: address?.line1 || "",
      line2: address?.line2 || "",
      city: address?.city || "",
      region: address?.region || "",
      postalCode: address?.postalCode || ""
    };
  } catch {
    return undefined;
  }
}

function nationalPhone(phone: string, dial?: string) {
  const compact = phone.replace(/[\s-]/g, "");
  if (dial && compact.startsWith(dial)) return compact.slice(dial.length).replace(/\D/g, "");
  return phone.replace(/\D/g, "");
}
