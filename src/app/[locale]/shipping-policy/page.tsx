import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function ShippingPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("policies.shipping");
  return <Policy title={t("title")} body={t("body")} />;
}

function Policy({ title, body }: { title: string; body: string }) {
  return (
    <section className="container-content section-pad">
      <article className="max-w-3xl">
        <p className="eyebrow">Policies</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">{title}</h1>
        <p className="mt-6 whitespace-pre-line text-lg leading-8 text-muted-foreground">{body}</p>
      </article>
    </section>
  );
}
