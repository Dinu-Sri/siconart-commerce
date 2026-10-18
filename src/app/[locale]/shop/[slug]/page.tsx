import { permanentRedirect } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";

export default async function LegacyShopProductPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  permanentRedirect(localeHref(locale as Locale, `/products/${slug}`));
}
