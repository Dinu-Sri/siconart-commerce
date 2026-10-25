"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, MessagesSquare, Package, Stamp } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";

export function ListShell({
  locale,
  children
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const priceHref = localeHref(locale, "/list");
  const ordersHref = localeHref(locale, "/list/orders");
  const agentsHref = localeHref(locale, "/list/agents");
  const feedbacksHref = localeHref(locale, "/list/feedbacks");
  const onOrders = pathname.includes("/list/orders");
  const onAgents = pathname.includes("/list/agents");
  const onFeedbacks = pathname.includes("/list/feedbacks");

  const links = [
    { href: priceHref, label: "Price list", icon: ClipboardList, active: !onOrders && !onAgents && !onFeedbacks },
    { href: ordersHref, label: "Orders", icon: Package, active: onOrders },
    { href: feedbacksHref, label: "Feedbacks", icon: MessagesSquare, active: onFeedbacks },
    { href: agentsHref, label: "Agents", icon: Stamp, active: onAgents }
  ];

  return (
    <div className="min-h-dvh bg-[#fef9ef] text-[#2f2118]" style={{ colorScheme: "light" }}>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-[#ead9c3] bg-[#f7efe3] xl:flex">
        <div className="border-b border-[#ead9c3] px-4 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a67146]">Sicon Art</p>
          <p className="mt-1 font-serif text-xl font-semibold">Internal</p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-list-nav={link.label}
              className={`inline-flex items-center gap-3 rounded-[0.5rem] px-3 py-2.5 text-sm font-semibold transition ${
                link.active ? "bg-[#a67146] text-white" : "text-[#6d4b32] hover:bg-white"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="xl:pl-56">
        <nav className="sticky top-0 z-20 flex gap-2 overflow-x-auto border-b border-[#ead9c3] bg-[#fef9ef] px-3 py-2 xl:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-list-nav={link.label}
              className={`inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold sm:text-sm ${
                link.active ? "border-[#a67146] bg-[#a67146] text-white" : "border-[#ead9c3] bg-white text-[#6d4b32]"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
