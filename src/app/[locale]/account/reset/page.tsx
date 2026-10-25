import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ResetPasswordForm } from "@/components/account/account-screens";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false }
};

export default async function ResetPasswordPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token = "" } = await searchParams;
  setRequestLocale(locale as Locale);

  return (
    <section className="container-content section-pad">
      {token ? <ResetPasswordForm token={token} /> : <p className="text-sm font-semibold">This reset link is missing its token.</p>}
    </section>
  );
}
