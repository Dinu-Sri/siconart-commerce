import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminAgentLeadsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale);
  const activeLocale = (await getLocale()) as Locale;
  const leads = await db.agentLead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <AdminShell locale={activeLocale} title="Agent leads">
      <div className="grid gap-4">
        {leads.length === 0 && <p className="rounded-[0.5rem] border bg-surface p-5 text-muted-foreground">No agent leads yet.</p>}
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-[0.5rem] border bg-surface p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">{lead.name}</h2>
                <a href={`mailto:${lead.email}`} className="text-sm text-primary">
                  {lead.email}
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                {[lead.company, lead.country].filter(Boolean).join(" - ") || "No location"}
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{lead.message}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
