import { revalidatePath } from "next/cache";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";

export default async function AdminCategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale);
  const activeLocale = (await getLocale()) as Locale;
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  async function addCategory(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    await db.category.create({
      data: {
        name,
        slug: slugify(name),
        description: String(formData.get("description") || "")
      }
    });
    revalidatePath(`/${locale}/admin/categories`);
  }

  async function updateCategory(formData: FormData) {
    "use server";
    await db.category.update({
      where: { id: String(formData.get("id")) },
      data: {
        name: String(formData.get("name") || ""),
        slug: slugify(String(formData.get("name") || "")),
        description: String(formData.get("description") || ""),
        active: formData.get("active") === "on"
      }
    });
    revalidatePath(`/${locale}/admin/categories`);
  }

  return (
    <AdminShell locale={activeLocale} title="Categories">
      <form action={addCategory} className="mb-8 grid gap-4 rounded-[0.5rem] border bg-surface p-5 md:grid-cols-[1fr_2fr_auto] md:items-end">
        <label className="text-sm font-semibold">
          Name
          <input required name="name" className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
        </label>
        <label className="text-sm font-semibold">
          Description
          <input name="description" className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
        </label>
        <Button type="submit">Add</Button>
      </form>

      <div className="grid gap-4">
        {categories.map((category) => (
          <form key={category.id} action={updateCategory} className="grid gap-4 rounded-[0.5rem] border bg-surface p-5 lg:grid-cols-[1fr_2fr_auto_auto] lg:items-end">
            <input type="hidden" name="id" value={category.id} />
            <label className="text-sm font-semibold">
              Name
              <input name="name" defaultValue={category.name} className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
            </label>
            <label className="text-sm font-semibold">
              Description
              <input
                name="description"
                defaultValue={category.description ?? ""}
                className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" name="active" defaultChecked={category.active} className="h-4 w-4 accent-primary" />
              Active
            </label>
            <Button type="submit">Update</Button>
          </form>
        ))}
      </div>
    </AdminShell>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
