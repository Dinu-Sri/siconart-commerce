"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localeLabels, routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LangToggle({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("language");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;

    const segments = pathname.split("/").filter(Boolean);
    const rest = routing.locales.includes(segments[0] as Locale) ? segments.slice(1).join("/") : segments.join("/");
    router.push(next === routing.defaultLocale ? `/${rest}` : `/${next}${rest ? `/${rest}` : ""}`);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t("label")}
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-subtle"
      >
        <Globe className="h-[18px] w-[18px]" />
        <span className="hidden sm:inline">{localeLabels[locale]}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 min-w-36 overflow-hidden rounded-2xl border bg-surface shadow-soft">
          {routing.locales.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => switchTo(item)}
              className={cn(
                "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-surface-subtle",
                item === locale && "font-semibold"
              )}
            >
              {localeLabels[item]}
              {item === locale && <span className="text-xs">•</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
