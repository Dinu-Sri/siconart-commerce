import { Star } from "lucide-react";

export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const iconClass = size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <span className="inline-flex items-center gap-1" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      <span className="inline-flex">
        {Array.from({ length: 5 }, (_, index) => {
          const filled = rating >= index + 0.75;
          return (
            <Star
              key={index}
              className={`${iconClass} ${filled ? "fill-[#e2a128] text-[#e2a128]" : "fill-[#ead9c3] text-[#ead9c3]"}`}
            />
          );
        })}
      </span>
      <span className="font-semibold text-[#6d4b32]">{rating.toFixed(1)}</span>
    </span>
  );
}