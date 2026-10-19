import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CERTIFICATE_COUNTRIES } from "@/data/certificate-countries";
import { listBrandAgents } from "@/lib/agent-certificates";
import { ListAgentsView } from "@/components/storefront/list-agents-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ListAgentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const agents = await listBrandAgents();
  return <ListAgentsView agents={agents} countries={CERTIFICATE_COUNTRIES} />;
}
