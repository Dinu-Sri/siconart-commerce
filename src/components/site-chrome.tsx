"use client";

import { usePathname } from "next/navigation";

export function SiteChrome({
  children,
  footer,
  header
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  header: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPrivateList = pathname === "/list" || pathname === "/en/list";

  if (isPrivateList) {
    return <main className="min-h-dvh">{children}</main>;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
}
