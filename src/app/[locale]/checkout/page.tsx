import type { Metadata } from "next";
import Script from "next/script";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CheckoutView } from "@/components/commerce/checkout-view";
import { getStorefrontProducts } from "@/lib/commerce/live-prices";

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

  return (
    <section className="container-content section-pad">
      <Script src="https://www.payhere.lk/lib/payhere.js" strategy="afterInteractive" data-payhere-sdk="true" />
      <CheckoutView locale={activeLocale} catalog={catalog} />
    </section>
  );
}
