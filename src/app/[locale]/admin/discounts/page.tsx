import { revalidatePath } from "next/cache";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";

export default async function AdminDiscountsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale);
  const activeLocale = (await getLocale()) as Locale;
  const discounts = await db.discountCode.findMany({ orderBy: { createdAt: "desc" } });

  async function saveDiscount(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const data = {
      code: String(formData.get("code") || "").toUpperCase(),
      type: String(formData.get("type") || "percent"),
      value: Number(formData.get("value") || 0),
      minSubtotalCents: dollarsToCents(String(formData.get("minimum") || "0")),
      active: formData.get("active") === "on"
    };

    if (id) {
      await db.discountCode.update({ where: { id }, data });
    } else {
      await db.discountCode.create({ data });
    }
    revalidatePath(`/${locale}/admin/discounts`);
  }

  return (
    <AdminShell locale={activeLocale} title="Discount codes">
      <DiscountForm action={saveDiscount} />
      <div className="mt-8 grid gap-4">
        {discounts.map((discount) => (
          <DiscountForm
            key={discount.id}
            action={saveDiscount}
            id={discount.id}
            code={discount.code}
            type={discount.type}
            value={discount.value}
            minimum={(discount.minSubtotalCents / 100).toFixed(2)}
            active={discount.active}
          />
        ))}
      </div>
    </AdminShell>
  );
}

function DiscountForm({
  action,
  id = "",
  code = "",
  type = "percent",
  value = 10,
  minimum = "100.00",
  active = true
}: {
  action: (formData: FormData) => Promise<void>;
  id?: string;
  code?: string;
  type?: string;
  value?: number;
  minimum?: string;
  active?: boolean;
}) {
  return (
    <form action={action} className="grid gap-4 rounded-[0.5rem] border bg-surface p-5 lg:grid-cols-[1fr_150px_120px_150px_auto_auto] lg:items-end">
      <input type="hidden" name="id" value={id} />
      <label className="text-sm font-semibold">
        Code
        <input required name="code" defaultValue={code} className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
      </label>
      <label className="text-sm font-semibold">
        Type
        <select name="type" defaultValue={type} className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2">
          <option value="percent">Percent</option>
          <option value="fixed">Fixed USD</option>
        </select>
      </label>
      <label className="text-sm font-semibold">
        Value
        <input required type="number" name="value" defaultValue={value} className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
      </label>
      <label className="text-sm font-semibold">
        Minimum
        <input required type="number" step="0.01" name="minimum" defaultValue={minimum} className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="active" defaultChecked={active} className="h-4 w-4 accent-primary" />
        Active
      </label>
      <Button type="submit">{id ? "Update" : "Add"}</Button>
    </form>
  );
}

function dollarsToCents(value: string) {
  return Math.round(Number(value) * 100);
}
