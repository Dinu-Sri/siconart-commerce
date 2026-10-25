"use client";

import { useState } from "react";

const MAX_EDGE = 1600;

async function compressPhoto(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose a JPG or PNG photo.");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Please choose a JPG or PNG photo. This phone photo type is not supported.");
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare that photo.");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (!blob) throw new Error("Could not prepare that photo.");
  if (blob.size > 1_500_000) throw new Error("That photo is still too large. Try a smaller one.");
  return blob;
}

export function FeedbackForm({
  token,
  customerName,
  orderNumber,
  products
}: {
  token: string;
  customerName: string;
  orderNumber: string;
  products: string[];
}) {
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<Blob[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function replacePhotos(next: Blob[]) {
    setPreviews((current) => {
      current.forEach((url) => URL.revokeObjectURL(url));
      return next.map((photo) => URL.createObjectURL(photo));
    });
    setPhotos(next);
  }

  async function addPhotos(list: FileList | null) {
    const files = Array.from(list || []);
    if (!files.length) return;
    setError("");
    const next = [...photos];
    for (const file of files) {
      if (next.length >= 4) {
        setError("You can add up to 4 photos.");
        break;
      }
      try {
        next.push(await compressPhoto(file));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not add that photo.");
        break;
      }
    }
    replacePhotos(next);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (String(form.get("company") || "").trim()) {
      setDone(true);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const payload = new FormData();
      payload.set("body", body.trim());
      photos.forEach((photo, index) => payload.append("photos", photo, `photo-${index + 1}.jpg`));
      const response = await fetch(`/api/feedback/${encodeURIComponent(token)}`, {
        method: "POST",
        body: payload
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "We could not save your feedback. Please try again.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not save your feedback. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <FeedbackCard>
        <h1 className="font-serif text-3xl font-semibold">Thank you</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          We received your feedback for order {orderNumber}. Our team will read it before it appears on the shop.
        </p>
      </FeedbackCard>
    );
  }

  return (
    <FeedbackCard>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Sicon Art</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">Share your feedback</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        Posting as {customerName}. Order {orderNumber}
        {products.length ? `: ${products.join(", ")}` : ""}.
      </p>
      <form className="mt-6" onSubmit={(event) => void submit(event)}>
        <input name="company" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] h-px w-px" aria-hidden="true" />
        <label className="block text-sm font-semibold" htmlFor="feedback-body">
          Your feedback
          <textarea
            id="feedback-body"
            required
            minLength={8}
            maxLength={2000}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="How were the brushes?"
            className="mt-2 min-h-36 w-full rounded-[0.5rem] border bg-background px-3 py-3 text-base leading-7 outline-none focus:border-primary"
          />
        </label>
        <div className="mt-4">
          <p className="text-sm font-semibold">Photos</p>
          <p className="mt-1 text-sm text-muted-foreground">Optional. JPG or PNG, up to 4 photos.</p>
          <label className="mt-2 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border px-5 text-sm font-semibold">
            Add photos
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(event) => {
                void addPhotos(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
          {previews.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {previews.map((src, index) => (
                <div key={src} className="relative h-20 w-20 overflow-hidden rounded-[0.5rem] border bg-white">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => replacePhotos(photos.filter((_, photoIndex) => photoIndex !== index))}
                    className="absolute right-1 top-1 rounded-full bg-white/95 px-1.5 text-xs font-bold text-[#523a27]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {error ? (
          <p className="mt-4 rounded-[0.5rem] border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send feedback"}
        </button>
      </form>
    </FeedbackCard>
  );
}

function FeedbackCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 sm:py-12">
      <section className="rounded-[1rem] border bg-surface p-5 shadow-sm sm:p-6">{children}</section>
    </div>
  );
}
