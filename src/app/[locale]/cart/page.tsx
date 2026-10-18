import type { Metadata } from "next";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CartView } from "@/components/commerce/cart-view";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;

  return (
    <section className="container-content section-pad">
      <CartView locale={activeLocale} />
    </section>
  );
}
