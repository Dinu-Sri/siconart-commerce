import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return (
    <Policy title="Privacy Policy" subtitle="Last updated: 23 March 2026">
      <p>
        SiconArt operates siconart.com. This policy explains how we collect, use, store, and protect personal
        information when you visit the website, place an order, or contact us.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We collect account and order information, contact form messages, newsletter sign-ups, device and browser data,
        usage data, and cookies or tracking technologies needed for cart, checkout, analytics, advertising, and
        preferences.
      </p>
      <h2>How We Use Information</h2>
      <p>
        We use information for order fulfilment, customer support, website improvement, marketing with consent,
        advertising measurement, fraud prevention, and legal compliance.
      </p>
      <h2>Sharing and Security</h2>
      <p>
        We do not sell personal information. We may share necessary data with shipping carriers, payment processors,
        analytics and advertising platforms, or legal authorities when required. We use HTTPS, trusted payment
        processors, and limited staff access to protect data.
      </p>
      <h2>Your Rights</h2>
      <p>
        Depending on your location, you may request access, correction, deletion, marketing opt-out, or data portability
        by emailing support@siconart.com.
      </p>
    </Policy>
  );
}

function Policy({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="container-content section-pad">
      <article className="max-w-3xl">
        <p className="eyebrow">Policies</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">{title}</h1>
        <p className="mt-4 text-muted-foreground">{subtitle}</p>
        <div className="mt-8 grid gap-5 leading-8 text-muted-foreground">{children}</div>
      </article>
    </section>
  );
}
