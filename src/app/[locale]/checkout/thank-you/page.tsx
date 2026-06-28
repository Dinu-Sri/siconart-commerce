import Link from "next/link";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { Button } from "@/components/ui/button";

export default async function CheckoutThankYouPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;

  return (
    <section className="container-content section-pad">
      <div className="max-w-2xl">
        <p className="eyebrow">Order received</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">Thank you for your order.</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          PayHere will confirm the payment status automatically. We will contact you if any shipping details need review.
        </p>
        <Button asChild className="mt-8">
          <Link href={localeHref(activeLocale, "/shop")}>Continue shopping</Link>
        </Button>
      </div>
    </section>
  );
}
