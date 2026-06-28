import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Discounts", href: "/admin/discounts" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Agent leads", href: "/admin/agent-leads" }
];

export function AdminShell({
  locale,
  title,
  children
}: {
  locale: Locale;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-content py-8 sm:py-10">
      <div className="mb-8 flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold">{title}</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={localeHref(locale, link.href)}
              className="rounded-full border bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface-subtle"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </section>
  );
}
