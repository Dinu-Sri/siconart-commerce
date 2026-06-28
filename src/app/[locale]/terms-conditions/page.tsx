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
        <p className="mt-4 text-muted-foreground">Last updated: 23 March 2026</p>
        <div className="mt-8 grid gap-5 leading-8 text-muted-foreground">
          <p>
            These Terms govern your access to and use of siconart.com, including purchases made through the website. By
            using the website, you agree to these Terms.
          </p>
          <h2>Products and Pricing</h2>
          <p>
            We aim for accurate product descriptions, images, and pricing. Handmade brush variations in natural hair and
            bamboo handles are normal. Prices do not include customs duties, import taxes, or additional shipping
            surcharges unless stated.
          </p>
          <h2>Orders and Payment</h2>
          <p>
            Placing an order is an offer to purchase. We may decline orders for unavailability, pricing errors,
            suspected fraud, or unreasonable quantity. Payment must be completed at checkout, and orders are confirmed by
            order confirmation.
          </p>
          <h2>Shipping, Returns, and Liability</h2>
          <p>
            Orders ship from Dongguan, China. Delivery times vary by destination and shipping method. Returns and refunds
            follow the Return & Exchange Policy. SiconArt is not liable for indirect or consequential damages, and total
            liability for a purchase is limited to the amount paid for that order.
          </p>
          <h2>Intellectual Property</h2>
          <p>
            Website text, images, logos, product designs, graphics, and layout belong to SiconArt or its licensors and
            may not be copied, reproduced, redistributed, or used commercially without permission.
          </p>
          <h2>Contact</h2>
          <p>Questions about these Terms can be sent to support@siconart.com.</p>
        </div>
      </article>
    </section>
  );
}
