import Image from "next/image";
import { Sparkle } from "lucide-react";

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
      <div className="absolute -left-4 top-24 inline-flex h-24 w-24 items-center justify-center rounded-full border bg-background/95 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-primary shadow-soft sm:left-[-2rem]">
        <Sparkle className="absolute h-7 w-7 fill-current" />
        <span className="[writing-mode:vertical-rl]">Smooth washes</span>
      </div>
    </div>
  );
}
