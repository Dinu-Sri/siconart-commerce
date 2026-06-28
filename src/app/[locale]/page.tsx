import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, CheckCircle2, Feather, Gift, Hand, PackageCheck, Palette } from "lucide-react";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { products } from "@/data/products";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { HeroProduct } from "@/components/storefront/hero-product";
import { ProductCard } from "@/components/storefront/product-card";
import { TestimonialsCarousel } from "@/components/storefront/testimonials-carousel";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const activeLocale = (await getLocale()) as Locale;
  const t = await getTranslations("home");
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const craftSteps = [
    {
      title: "Material Selection",
      body: "Premium natural hair and bamboo sourced with care",
      icon: Feather
    },
    {
      title: "Hand Assembly",
      body: "Each brush tip shaped and bound by skilled artisans",
      icon: Hand
    },
    {
      title: "Quality Testing",
      body: "Tested for water absorption, snap-back, and point",
      icon: BadgeCheck
    }
  ];
  const experienceCards = [
    {
      title: "Signature Series",
      body: "Curated brush collections designed for specific techniques, from fine detail to bold washes.",
      image: "/brand/experience-craft-1.jpg",
      icon: PackageCheck
    },
    {
      title: "Gift Sets",
      body: "Beautifully packaged brush sets perfect for gifting to the watercolor artist in your life.",
      image: "/brand/experience-craft-2.webp",
      icon: Gift
    },
    {
      title: "Custom Orders",
      body: "Work with our master brush makers to create brushes tailored to your painting style.",
      image: "/brand/experience-craft-3.jpg",
      icon: Palette
    },
    {
      title: "Artisan Craft",
      body: "Every brush is handmade using traditional Chinese brush-making methods passed through generations.",
      image: "/brand/experience-craft-4.jpg",
      icon: Feather
    }
  ];
  const faqPreview = [
    {
      q: "What makes Sicon Art brushes different from other brands?",
      a: "Every Sicon Art brush is handcrafted using traditional Chinese brush-making techniques. We use premium natural hair that holds water generously and releases paint with precision."
    },
    {
      q: "What type of hair is used in your brushes?",
      a: "We use carefully selected natural hair blends including goat, weasel, and mixed hair. Each blend is chosen for soft washes, fine detail, or versatile all-round performance."
    },
    {
      q: "Do you ship internationally?",
      a: "Yes. Orders ship from Dongguan, China. Shipping costs vary by destination and are shown during checkout where available."
    }
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b bg-[linear-gradient(90deg,hsl(var(--background)),hsl(var(--surface-subtle)))]">
        <Image
          src="/brand/hero-line-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover opacity-[0.055]"
        />
        <div className="container-content relative grid min-h-[calc(100dvh-8rem)] items-center gap-10 py-10 lg:grid-cols-[0.9fr_0.82fr] lg:py-14">
          <div className="relative z-10">
            <p className="eyebrow">{t("heroEyebrow")}</p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={localeHref(activeLocale, "/shop")}>{t("heroPrimary")}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={localeHref(activeLocale, "/become-an-agent")}>{t("heroSecondary")}</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-8 lg:flex-nowrap">
              {["ships", "handmade", "watercolor"].map((key) => (
                <div key={key} className="flex items-center gap-2 whitespace-nowrap">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {t(`trust.${key}`)}
                </div>
              ))}
            </div>
            <div className="mt-10 grid overflow-hidden rounded-[1.5rem] border bg-white shadow-soft sm:grid-cols-[0.9fr_1fr] lg:max-w-xl">
              <div className="relative min-h-32 bg-white">
                <Image src="/brand/classic-brushes.webp" alt="Sicon Art classic brushes" fill sizes="260px" className="object-contain p-4" />
              </div>
              <div className="flex items-center gap-4 p-5">
                <div className="flex -space-x-3">
                  {["A", "M", "S"].map((letter) => (
                    <span
                      key={letter}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-primary text-sm font-bold text-primary-foreground"
                    >
                      {letter}
                    </span>
                  ))}
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-accent text-2xl text-accent-foreground">
                    +
                  </span>
                </div>
                <div>
                  <p className="font-serif text-xl font-semibold">Loved by watercolorists</p>
                  <p className="mt-1 text-sm text-muted-foreground">4.9 (250+) reviews</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/brand/hero-flower.png"
              alt=""
              width={90}
              height={220}
              className="pointer-events-none absolute -left-8 bottom-16 z-10 hidden opacity-70 md:block"
            />
            <HeroProduct />
          </div>
        </div>
      </section>

      <section className="container-content section-pad">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">{t("featuredEyebrow")}</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">{t("featuredTitle")}</h2>
          </div>
          <Link href={localeHref(activeLocale, "/shop")} className="inline-flex items-center gap-2 font-semibold text-primary">
            {t("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.sku} product={product} locale={activeLocale} />
          ))}
        </div>
      </section>

      <section className="border-y bg-surface-subtle">
        <div className="container-content section-pad grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow">{t("agentEyebrow")}</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">{t("agentTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("agentBody")}</p>
          </div>
          <Button asChild size="lg">
            <Link href={localeHref(activeLocale, "/become-an-agent")}>{t("agentCta")}</Link>
          </Button>
        </div>
      </section>

      <section className="container-content section-pad">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_0.9fr_1fr] lg:items-center">
          <div className="grid gap-5">
            {craftSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex gap-5 rounded-[1.5rem] border bg-surface p-5 shadow-soft">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-primary">{step.title}</h2>
                    <p className="mt-2 text-sm leading-6">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-[360px]">
            <div className="absolute inset-0 overflow-hidden rounded-t-full border border-primary/25 bg-surface">
              <Image
                src="/brand/brush-making.jpg"
                alt="Sicon Art brush making materials"
                fill
                sizes="(min-width: 1024px) 30vw, 80vw"
                className="object-cover"
              />
            </div>
            <Image
              src="/brand/brush-making-flower.png"
              alt=""
              width={74}
              height={178}
              className="pointer-events-none absolute -left-12 bottom-2 z-10 hidden opacity-75 sm:block"
            />
          </div>

          <div>
            <p className="eyebrow">Craft</p>
            <h2 className="mt-3 font-serif text-5xl font-semibold leading-tight">
              The Art of <span className="text-primary">Brush Making</span>
            </h2>
            <p className="mt-5 leading-8 text-muted-foreground">
              Every Sicon Art brush begins as a vision: natural hair carefully selected, bamboo handles shaped by hand,
              and generations of craft knowledge woven into each stroke-ready tool.
            </p>
            <Button asChild className="mt-8">
              <Link href={localeHref(activeLocale, "/about")}>Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y bg-surface-subtle">
        <div className="container-content section-pad grid gap-10 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="eyebrow">{t("craftEyebrow")}</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">{t("craftTitle")}</h2>
          </div>
          <div className="grid gap-6 text-lg leading-8 text-muted-foreground">
            <p>{t("craftBodyOne")}</p>
            <p>{t("craftBodyTwo")}</p>
            <Button asChild variant="secondary" className="w-fit">
              <Link href={localeHref(activeLocale, "/about")}>{t("craftCta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-content section-pad">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-5xl font-semibold leading-tight">
            Experience the <span className="text-primary">Craft</span> Behind Every Brush
          </h2>
          <p className="mt-4 text-muted-foreground">
            From raw materials to your easel, each Sicon Art brush passes through hands that understand what watercolor
            artists truly need.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {experienceCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="overflow-hidden rounded-t-full border bg-surface text-center shadow-soft">
                <div className="relative aspect-[1/1.05] bg-white">
                  <Image src={card.image} alt={card.title} fill sizes="(min-width: 1024px) 24vw, 50vw" className="object-cover" />
                </div>
                <div className="relative px-6 pb-8 pt-10">
                  <span className="absolute left-1/2 top-0 inline-flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background text-primary shadow-soft">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="font-serif text-2xl font-semibold">{card.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{card.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-surface-subtle">
        <div className="container-content section-pad">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-5xl font-semibold leading-tight">
              What Artists Say About <span className="text-primary">Sicon Art</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hear from watercolor artists around the world who trust Sicon Art brushes for their creative work.
            </p>
          </div>
          <div className="mt-10">
            <TestimonialsCarousel />
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div className="grid gap-3">
              {faqPreview.map((item, index) => (
                <details key={item.q} open={index === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-4 rounded-full bg-primary/30 px-6 py-4 font-serif text-lg font-semibold">
                    <span className="text-2xl leading-none group-open:hidden">+</span>
                    <span className="hidden text-2xl leading-none group-open:inline">-</span>
                    {item.q}
                  </summary>
                  <p className="px-16 py-5 leading-7 text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
            <div>
              <h2 className="font-serif text-5xl font-semibold leading-tight">Frequently Asked Questions</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Everything you need to know about our brushes, materials, shipping, and care instructions.
              </p>
              <Button asChild className="mt-7">
                <Link href={localeHref(activeLocale, "/faq")}>View all FAQ</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
