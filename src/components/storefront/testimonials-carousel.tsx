"use client";

import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Jhon Martin",
    role: "Watercolor Artist",
    image: "/brand/artist-jhon.jpg",
    quote:
      "These brushes hold water like nothing I have used before. The snap-back on the tip is incredible - perfect for fine detail work and broad washes alike."
  },
  {
    name: "Emma Colins",
    role: "Art Instructor",
    image: "/brand/artist-emma.jpg",
    quote:
      "I recommend Sicon Art brushes to all my students. The natural hair tips give you so much control, and they are built to last through years of daily use."
  },
  {
    name: "Olivia Reed",
    role: "Plein Air Painter",
    image: "/brand/artist-olivia.jpg",
    quote:
      "The travel brushes are a game-changer for painting outdoors. Compact, lightweight, and they still perform like full-sized studio brushes."
  },
  {
    name: "Sara Lin",
    role: "Urban Sketcher",
    image: "/brand/artist-sara.jpg",
    quote:
      "The balance feels calm in the hand, and the point returns beautifully. It lets me move from line to wash without changing tools."
  }
];

export function TestimonialsCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((index) => (index + 1) % testimonials.length), 4200);
    return () => window.clearInterval(timer);
  }, []);

  const visible = [0, 1, 2].map((offset) => testimonials[(active + offset) % testimonials.length]);

  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-3">
        {visible.map((item) => (
          <article key={item.name} className="relative overflow-hidden rounded-[1.5rem] border bg-surface p-6 shadow-soft">
            <div className="flex gap-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="mt-6 min-h-28 leading-7 text-muted-foreground">{item.quote}</p>
            <div className="mt-6 flex items-center gap-4">
              <Image src={item.image} alt={item.name} width={58} height={58} className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h3 className="font-serif text-xl font-semibold">{item.name}</h3>
                <p className="text-sm text-primary">{item.role}</p>
              </div>
              <Quote className="ml-auto h-10 w-10 fill-primary/30 text-primary/30" />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((item, index) => (
          <button
            key={item.name}
            type="button"
            aria-label={`Show ${item.name} testimonial`}
            onClick={() => setActive(index)}
            className={cn("h-2.5 w-2.5 rounded-full bg-border", index === active && "bg-primary")}
          />
        ))}
      </div>
    </div>
  );
}
