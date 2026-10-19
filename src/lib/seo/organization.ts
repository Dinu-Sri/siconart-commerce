import { SUPPORT_EMAIL, SUPPORT_INSTAGRAM_LINK, SUPPORT_WHATSAPP_LINK } from "@/lib/support";
import { absoluteUrl, siteOrigin } from "@/lib/site-origin";
import { SICONART_BRAND_NAME, SICONART_LEGAL_ADDRESS_ZH, SICONART_LEGAL_NAME_ZH } from "@/lib/siconart-company";

export function organizationId() {
  return `${siteOrigin()}/#organization`;
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    "@id": organizationId(),
    name: SICONART_BRAND_NAME,
    legalName: SICONART_LEGAL_NAME_ZH,
    url: siteOrigin(),
    email: SUPPORT_EMAIL,
    image: absoluteUrl("/brand/siconart-logo-header.webp"),
    logo: absoluteUrl("/brand/siconart-logo-header.webp"),
    sameAs: [SUPPORT_INSTAGRAM_LINK, "https://www.facebook.com/siconart", SUPPORT_WHATSAPP_LINK],
    address: {
      "@type": "PostalAddress",
      streetAddress: SICONART_LEGAL_ADDRESS_ZH,
      addressLocality: "Dongguan",
      addressRegion: "Guangdong",
      addressCountry: "CN"
    }
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteOrigin()}/#website`,
    url: siteOrigin(),
    name: "Sicon Art",
    publisher: { "@id": organizationId() }
  };
}
