import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { hasListAccess } from "@/lib/price-list-access";
import { ListShell } from "@/components/storefront/list-shell";
import { ListUnlock } from "@/components/storefront/list-unlock";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  }
};

export default async function ListLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const hasAccess = await hasListAccess();

  if (!hasAccess) {
    return <ListUnlock />;
  }

  return <ListShell locale={locale as Locale}>{children}</ListShell>;
}
