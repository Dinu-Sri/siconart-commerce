"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = images[activeIndex] ?? images[0];

  if (!current) return null;

  return (
    <div className="grid gap-4">
      <div className="relative aspect-square overflow-hidden rounded-[0.5rem] border bg-white">
        <Image
          src={current}
          alt={`${name} by Sicon Art`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-6 sm:p-10"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${name}`}
              aria-pressed={index === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-[0.5rem] border bg-white transition",
                index === activeIndex ? "border-primary ring-2 ring-primary/25" : "hover:border-primary/50"
              )}
            >
              <Image src={image} alt="" fill sizes="20vw" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
