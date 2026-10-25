import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { listOrderFeedbacks } from "@/lib/order-feedback";
import { ListFeedbacksView } from "@/components/storefront/list-feedbacks-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ListFeedbacksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const { rows, error } = await listOrderFeedbacks();
  return <ListFeedbacksView locale={activeLocale} feedbacks={rows} loadError={error} />;
}
