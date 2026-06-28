import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return (
    <section className="container-content section-pad">
      <article className="max-w-3xl">
        <p className="eyebrow">Policies</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">Terms & Conditions</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Full terms and conditions content will be migrated and reviewed before launch.
        </p>
      </article>
    </section>
  );
}
