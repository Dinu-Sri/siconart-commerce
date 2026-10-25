"use client";

import { useState } from "react";

export function FeedbackPhotos({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!ids.length) return null;

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        {ids.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setOpen(id)}
            className="h-20 w-20 overflow-hidden rounded-[0.5rem] border border-[#ead9c3] bg-white"
          >
            <img src={`/api/feedback/photos/${id}`} alt="Customer photo" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(null);
          }}
        >
          <div className="max-h-[90dvh] max-w-3xl">
            <img src={`/api/feedback/photos/${open}`} alt="Customer photo" className="max-h-[80dvh] w-full rounded-[0.5rem] bg-white object-contain" />
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="mt-3 w-full rounded-[0.5rem] bg-white px-4 py-3 text-sm font-semibold text-[#523a27]"
            >
              Close photo
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
