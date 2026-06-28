import { ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale);
  const activeLocale = (await getLocale()) as Locale;

  const [products, categories] = await Promise.all([
    db.product.findMany({ orderBy: [{ status: "asc" }, { name: "asc" }] }),
    db.category.findMany({ orderBy: { name: "asc" } })
  ]);

  async function addProduct(formData: FormData) {
    "use server";

    const name = String(formData.get("name") || "");
    const category = String(formData.get("category") || "Brushes");
    const priceCents = dollarsToCents(String(formData.get("price") || "0"));

    await db.product.create({
      data: {
        sku: String(formData.get("sku") || `SA-${Date.now()}`),
        slug: slugify(name),
        name,
        category,
        summary: String(formData.get("summary") || ""),
        description: String(formData.get("description") || ""),
        status: ProductStatus.DRAFT,
        priceCents,
        images: splitLines(String(formData.get("images") || "")),
        uses: ["studio"],
        handle: "short",
        feel: "balanced",
        level: "enthusiast",
        specs: parseSpecs(String(formData.get("specs") || "{}"))
      }
    });
    revalidatePath(`/${locale}/admin/products`);
  }

  async function updateProduct(formData: FormData) {
    "use server";

    await db.product.update({
      where: { id: String(formData.get("id")) },
      data: {
        name: String(formData.get("name") || ""),
        category: String(formData.get("category") || ""),
        summary: String(formData.get("summary") || ""),
        description: String(formData.get("description") || ""),
        status: String(formData.get("status")) as ProductStatus,
        priceCents: dollarsToCents(String(formData.get("price") || "0")),
        images: splitLines(String(formData.get("images") || "")),
        specs: parseSpecs(String(formData.get("specs") || "{}"))
      }
    });
    revalidatePath(`/${locale}/admin/products`);
  }

  async function setProductStatus(formData: FormData) {
    "use server";

    await db.product.update({
      where: { id: String(formData.get("id")) },
      data: { status: String(formData.get("nextStatus")) as ProductStatus }
    });
    revalidatePath(`/${locale}/admin/products`);
  }

  async function deleteProduct(formData: FormData) {
    "use server";

    await db.product.delete({ where: { id: String(formData.get("id")) } });
    revalidatePath(`/${locale}/admin/products`);
  }

  return (
    <AdminShell locale={activeLocale} title="Products">
      <form action={addProduct} className="mb-8 grid gap-4 rounded-[0.5rem] border bg-surface p-5">
        <h2 className="font-serif text-2xl font-semibold">Add product</h2>
        <div className="grid gap-4 lg:grid-cols-4">
          <Input name="sku" label="SKU" required />
          <Input name="name" label="Name" required />
          <Select name="category" label="Category" options={categories.map((category) => category.name)} />
          <Input name="price" label="Price USD" type="number" step="0.01" required />
        </div>
        <Input name="summary" label="Short summary" required />
        <Textarea name="description" label="Description" required />
        <Textarea name="images" label="Images, one URL per line" required />
        <Textarea name="specs" label="Specs JSON" defaultValue={'{"Best for":"Watercolor","Handle":"Short"}'} />
        <Button type="submit" className="w-fit">
          Add as draft
        </Button>
      </form>

      <div className="grid gap-5">
        {products.map((product) => (
          <form key={product.id} action={updateProduct} className="rounded-[0.5rem] border bg-surface p-5">
            <input type="hidden" name="id" value={product.id} />
            <div className="grid gap-4 lg:grid-cols-[1fr_180px_140px_150px]">
              <Input name="name" label="Name" defaultValue={product.name} />
              <Select
                name="category"
                label="Category"
                defaultValue={product.category}
                options={categories.map((category) => category.name)}
              />
              <Input name="price" label="Price USD" type="number" step="0.01" defaultValue={centsToDollars(product.priceCents)} />
              <label className="text-sm font-semibold">
                Status
                <select name="status" defaultValue={product.status} className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2">
                  {Object.values(ProductStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Textarea name="summary" label="Summary" defaultValue={product.summary} />
              <Textarea name="images" label="Images, one URL per line" defaultValue={product.images.join("\n")} />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Textarea name="description" label="Description" defaultValue={product.description} />
              <Textarea name="specs" label="Specification table JSON" defaultValue={JSON.stringify(product.specs, null, 2)} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="submit">Update</Button>
              <Button type="submit" formAction={setProductStatus} name="nextStatus" value={ProductStatus.DRAFT} variant="secondary">
                Draft
              </Button>
              <Button
                type="submit"
                formAction={setProductStatus}
                name="nextStatus"
                value={ProductStatus.ARCHIVED}
                variant="secondary"
              >
                Trash
              </Button>
              <Button type="submit" formAction={setProductStatus} name="nextStatus" value={ProductStatus.ACTIVE} variant="secondary">
                Restore
              </Button>
              <Button type="submit" formAction={deleteProduct} variant="secondary">
                Delete
              </Button>
            </div>
          </form>
        ))}
      </div>
    </AdminShell>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="text-sm font-semibold">
      {label}
      <input {...inputProps} className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
    </label>
  );
}

function Select({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <select {...props} className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string }) {
  const { label, ...textareaProps } = props;
  return (
    <label className="text-sm font-semibold">
      {label}
      <textarea {...textareaProps} rows={4} className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2" />
    </label>
  );
}

function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSpecs(value: string) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function dollarsToCents(value: string) {
  return Math.round(Number(value) * 100);
}

function centsToDollars(value: number) {
  return (value / 100).toFixed(2);
}
