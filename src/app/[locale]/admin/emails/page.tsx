import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/admin-auth";
import { emailCatalog, type EmailKind } from "@/lib/email";
import { AdminShell } from "@/components/admin/admin-shell";
import { EmailTestPanel } from "@/components/admin/email-test-panel";

export default async function AdminEmailsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await requireAdmin(locale);

  const templates = (Object.keys(emailCatalog) as EmailKind[]).map((kind) => ({
    kind,
    label: emailCatalog[kind].label
  }));

  return (
    <AdminShell locale={locale as Locale} title="Email templates">
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Preview every transactional email here, then send a [TEST] copy to NOTIFY_EMAIL_1 and NOTIFY_EMAIL_2. Use Send
        all tests to check every template in one go. Sample order and form data is used.
      </p>
      <EmailTestPanel templates={templates} />
    </AdminShell>
  );
}
