import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { FeedbackForm } from "@/components/storefront/feedback-form";
import { getPublicFeedbackForm } from "@/lib/order-feedback";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Share your feedback",
  robots: { index: false, follow: false }
};

export default async function FeedbackPage({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale, token } = await params;
  setRequestLocale(locale as Locale);
  const form = await getPublicFeedbackForm(decodeURIComponent(token));

  if (form === "unavailable") {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-12">
        <section className="rounded-[1rem] border bg-surface p-5">
          <h1 className="font-serif text-3xl font-semibold">Try again</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            We could not open this form right now. Please try again in a moment.
          </p>
        </section>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-12">
        <section className="rounded-[1rem] border bg-surface p-5">
          <h1 className="font-serif text-3xl font-semibold">Link not valid</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This feedback link is not valid. Ask Sicon Art to send you a new one.
          </p>
        </section>
      </div>
    );
  }

  if (form.submitted) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-12">
        <section className="rounded-[1rem] border bg-surface p-5">
          <h1 className="font-serif text-3xl font-semibold">Thank you</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            We already have your feedback for order {form.orderNumber}.
          </p>
        </section>
      </div>
    );
  }

  return (
    <FeedbackForm
      token={decodeURIComponent(token)}
      customerName={form.customerName}
      orderNumber={form.orderNumber}
      products={form.products}
    />
  );
}
