import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CheckoutView } from "@/components/commerce/checkout-view";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;

  return (
    <section className="container-content section-pad">
      <CheckoutView locale={activeLocale} />
    </section>
  );
}
