import { BadgeCheck } from "lucide-react";
import { FeedbackPhotos } from "@/components/storefront/feedback-photos";
import type { PublicProductFeedback } from "@/lib/order-feedback-types";

export function ProductFeedback({ items }: { items: PublicProductFeedback[] }) {
  if (!items.length) return null;

  return (
    <section className="mt-16">
      <p className="eyebrow">Verified purchases</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold">Customer feedback</h2>
      <div className="mt-8 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-[0.5rem] border bg-surface p-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{item.customerName}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Verified purchase
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{item.dateLabel}</p>
            <p className="mt-4 whitespace-pre-wrap text-base leading-7">{item.body}</p>
            <FeedbackPhotos ids={item.imageIds} />
          </article>
        ))}
      </div>
    </section>
  );
}
