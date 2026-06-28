import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <section className="container-content section-pad">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[0.5rem] border bg-surface">
          <Image
            src="/brand/tina-wang-about.webp"
            alt="Wang Feng Tina painting outdoors"
            fill
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover"
          />
        </div>
        <article>
          <p className="eyebrow">The Founder</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">Meet the Artist Behind the Brushes</h1>
          <div className="mt-5 grid gap-5 text-lg leading-8 text-muted-foreground">
            <p>
              Wang Feng (Tina) is a self-taught watercolor artist and plein air painter based in Dongguan, China. Known
              for painting from life - capturing traditional architecture, street scenes, and nature through urban
              sketching and on-location watercolor - Tina brings careful observation and emotional depth to every subject
              she paints.
            </p>
            <p>
              In 2015, she founded Encore Fine Arts Studio, and a decade later, her deep appreciation for traditional
              Chinese brush craftsmanship led her to create Sicon Art in 2025 - a brand built to share the magic of
              handcrafted Chinese brushes with artists everywhere.
            </p>
          </div>
          <blockquote className="mt-8 rounded-[0.5rem] border bg-surface p-6 font-serif text-xl italic leading-8 text-foreground">
            "My watercolor is my inner journey toward freedom - so don't be afraid to paint what your heart truly feels."
          </blockquote>
          <p className="mt-6 leading-7 text-muted-foreground">
            Tina's work has earned multiple awards including an Honorable Mention and Art Sparks Merchandise Award at the
            Women in Watercolor International Competition (2025), and a national prize in China's Urban Sketch
            Competition (2022). In 2026, she was appointed Deputy Secretary-General of the Dongguan Artists Association.
            Her exhibitions span from solo shows in Sri Lanka to international sketchwalk events across Asia.
          </p>
        </article>
      </div>
    </section>
  );
}
