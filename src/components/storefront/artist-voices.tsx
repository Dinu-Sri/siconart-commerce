import Image from "next/image";
import { artistVoices } from "@/data/testimonials";

export function ArtistVoices() {
  return (
    <section className="container-content section-pad">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Artists</p>
        <h2 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Painters using Sicon Art</h2>
        <p className="mt-4 text-muted-foreground">
          Words from artists who paint with our handmade Chinese watercolor brushes. We sometimes send brushes to
          artists we work with.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {artistVoices.map((voice) => (
          <figure key={voice.slug} className="overflow-hidden rounded-[0.5rem] border bg-surface shadow-soft">
            <div className="relative aspect-[3/4] bg-white">
              <Image
                src={voice.image.src}
                alt={voice.image.alt}
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="p-5">
              <blockquote className="font-serif text-xl leading-8 text-foreground">“{voice.quote}”</blockquote>
              <p className="mt-4 text-sm font-semibold">{voice.name}</p>
              <p className="text-sm text-muted-foreground">{voice.handle}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
