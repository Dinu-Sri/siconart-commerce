import { permanentRedirect } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";

export default async function ReturnPolicyRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  permanentRedirect(localeHref(locale as Locale, "/return-exchange-policy"));
}
