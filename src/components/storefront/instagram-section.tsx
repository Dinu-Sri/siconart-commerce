import Image from "next/image";
import { Instagram } from "lucide-react";
import { INSTAGRAM_HIGHLIGHT_TITLE, INSTAGRAM_HIGHLIGHT_URL } from "@/data/instagram";
import type { InstagramItem } from "@/lib/instagram";
import { Button } from "@/components/ui/button";

export function ArtistsAroundWorldSection({ stories }: { stories: InstagramItem[] }) {
  return (
    <section className="border-y bg-surface-subtle">
      <div className="container-content section-pad">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Artists worldwide</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              See what artists say — and how they use Sicon Art <span className="text-primary">around the world</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              From our Instagram {INSTAGRAM_HIGHLIGHT_TITLE} highlight: painters, sketchers, and students using Sicon Art
              brushes internationally.
            </p>
          </div>
          <Button asChild size="lg">
            <a href={INSTAGRAM_HIGHLIGHT_URL} target="_blank" rel="noreferrer">
              <Instagram className="h-4 w-4" />
              Open Artists Works
            </a>
          </Button>
        </div>

        {stories.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {stories.map((item) => (
              <a
                key={item.src}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-[1.5rem] border bg-surface shadow-soft"
              >
                <div className="relative aspect-[3/4] bg-black">
                  {item.kind === "video" ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={item.poster}
                      src={item.src}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 50vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
