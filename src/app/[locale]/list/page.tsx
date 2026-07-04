import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { products } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { ProductPriceList } from "@/components/storefront/product-price-list";
import { Button } from "@/components/ui/button";

const ACCESS_COOKIE = "siconart_list_access";
const LIST_PASSWORD = "tina";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ListPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const activeLocale = locale as Locale;
  const query = searchParams ? await searchParams : {};
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get(ACCESS_COOKIE)?.value === "1";

  async function unlockList(formData: FormData) {
    "use server";

    const password = String(formData.get("password") || "").trim();
    const listPath = localeHref(activeLocale, "/list");

    if (password !== LIST_PASSWORD) {
      redirect(`${listPath}?error=1`);
    }

    const writableCookies = await cookies();
    writableCookies.set(ACCESS_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
    redirect(listPath);
  }

  if (!hasAccess) {
    return (
      <section className="container-content flex min-h-[70vh] items-center justify-center py-12">
        <form action={unlockList} className="w-full max-w-sm rounded-[0.5rem] border bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <div>
              <p className="eyebrow">Private list</p>
              <h1 className="font-serif text-2xl font-semibold">Price List Access</h1>
            </div>
          </div>

          <label className="text-sm font-semibold">
            Password
            <input
              autoFocus
              required
              type="password"
              name="password"
              className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-3 outline-none transition focus:border-primary"
              placeholder="Enter password"
            />
          </label>

          {query.error === "1" && <p className="mt-3 text-sm font-semibold text-red-600">Password is incorrect.</p>}

          <Button type="submit" className="mt-5 w-full">
            Open list
          </Button>
        </form>
      </section>
    );
  }

  return <ProductPriceList products={products} />;
}
