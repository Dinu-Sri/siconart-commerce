"use client";

import { usePathname } from "next/navigation";
import { SUPPORT_WHATSAPP_DISPLAY, SUPPORT_WHATSAPP_LINK } from "@/lib/support";

export function WhatsAppFloat() {
  const pathname = usePathname();
  const hidden = pathname === "/list" || pathname === "/en/list" || pathname.includes("/admin");
  if (hidden) return null;

  return (
    <a
      href={SUPPORT_WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      title={`Chat about your order on WhatsApp ${SUPPORT_WHATSAPP_DISPLAY}`}
      aria-label={`Chat about your order on WhatsApp ${SUPPORT_WHATSAPP_DISPLAY}`}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.477-.883-.788-1.479-1.761-1.652-2.058-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.099-.198.05-.372-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.009-.372-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.077 4.49.71.306 1.263.489 1.695.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403a9.916 9.916 0 0 1-5.032-1.367L2 21.75l1.36-4.975A9.909 9.909 0 1 1 12.05 21.785zm0-18.0a8.076 8.076 0 0 0-6.862 12.326l.2.318-.808 2.958 3.037-.797.311.185a8.08 8.08 0 1 0 4.122-14.99z" />
      </svg>
    </a>
  );
}
