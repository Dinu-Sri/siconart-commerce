import Image from "next/image";

export function HeroProduct() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-t-full border border-primary/30 bg-surface shadow-lift">
      <Image
        src="/brand/hero-image.webp"
        alt="Sicon Art brush painting watercolor"
        fill
        priority
        sizes="(min-width: 1024px) 42vw, 90vw"
        className="object-cover"
      />
    </div>
  );
}
