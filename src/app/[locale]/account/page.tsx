import type { Metadata } from "next";
import { getLocale, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AccountAuth, AccountHome } from "@/components/account/account-screens";
import { getAccountSnapshot } from "@/lib/customer-account";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false }
};

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const account = await getAccountSnapshot();

  return (
    <section className="container-content section-pad">
      {account ? (
        <AccountHome
          locale={activeLocale}
          customer={account.customer}
          orders={account.orders}
          addresses={account.addresses}
        />
      ) : (
        <AccountAuth locale={activeLocale} />
      )}
    </section>
  );
}
