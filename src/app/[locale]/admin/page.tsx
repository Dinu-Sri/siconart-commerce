import { redirect } from "next/navigation";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { clearAdminSession, requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale);
  const activeLocale = (await getLocale()) as Locale;

  const [products, categories, discounts, orders, leads] = await Promise.all([
    db.product.count(),
    db.category.count(),
    db.discountCode.count(),
    db.order.count(),
    db.agentLead.count()
  ]);

  async function logout() {
    "use server";
    await clearAdminSession();
    redirect(`/${locale}/admin/login`);
  }

  const cards = [
    { label: "Products", value: products },
    { label: "Categories", value: categories },
    { label: "Discount codes", value: discounts },
    { label: "Orders", value: orders },
    { label: "Agent leads", value: leads }
  ];

  return (
    <AdminShell locale={activeLocale} title="Commerce dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[0.5rem] border bg-surface p-5">
            <p className="text-sm font-semibold text-muted-foreground">{card.label}</p>
            <p className="mt-3 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
      <form action={logout} className="mt-8">
        <Button type="submit" variant="secondary">
          Sign out
        </Button>
      </form>
    </AdminShell>
  );
}
