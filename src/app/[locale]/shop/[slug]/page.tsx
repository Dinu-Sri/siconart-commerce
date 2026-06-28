import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";

export default async function ProductPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  redirect(localeHref(locale as Locale, `/products/${slug}`));
}
