import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ParcelTracking } from "@/components/storefront/parcel-tracking";
import { pageMeta } from "@/lib/seo/page-meta";

export const metadata = pageMeta({
  title: "Parcel tracking",
  description: "Track a Sicon Art parcel with your YunExpress tracking number.",
  path: "/track-your-order"
});

export default async function TrackYourOrderPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { locale } = await params;
  const { code = "" } = await searchParams;
  setRequestLocale(locale as Locale);

  return (
    <section className="container-content section-pad">
      <ParcelTracking initialCode={code} />
    </section>
  );
}
