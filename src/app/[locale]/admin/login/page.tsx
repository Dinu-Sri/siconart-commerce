import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createAdminSession, isValidAdminLogin } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";

export default async function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  async function login(formData: FormData) {
    "use server";

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    if (!isValidAdminLogin(email, password)) redirect(`/${locale}/admin/login?error=1`);

    await createAdminSession();
    redirect(`/${locale}/admin`);
  }

  return (
    <section className="container-content section-pad">
      <div className="mx-auto max-w-md rounded-[0.5rem] border bg-surface p-6">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold">Sign in</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Use the admin email and password from your server environment.
        </p>
        <form action={login} className="mt-6 grid gap-4">
          <label className="text-sm font-semibold">
            Email
            <input
              required
              type="email"
              name="email"
              className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm font-semibold">
            Password
            <input
              required
              type="password"
              name="password"
              className="mt-2 w-full rounded-[0.5rem] border bg-background px-3 py-2"
            />
          </label>
          <Button type="submit">Sign in</Button>
        </form>
      </div>
    </section>
  );
}
