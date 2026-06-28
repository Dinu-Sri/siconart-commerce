import Image from "next/image";
import { Sparkle } from "lucide-react";

export function HeroProduct() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-t-full border bg-surface-subtle shadow-lift">
      <Image
        src="/products/chi-ling-travel-feature.jpg"
        alt="Sicon Art travel brush"
        fill
        priority
        sizes="(min-width: 1024px) 42vw, 90vw"
        className="object-contain p-10"
      />
      <div className="absolute left-6 top-8 inline-flex h-24 w-24 items-center justify-center rounded-full border bg-background/90 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-primary shadow-soft">
        <Sparkle className="absolute h-7 w-7 fill-current" />
      </div>
    </div>
  );
}
