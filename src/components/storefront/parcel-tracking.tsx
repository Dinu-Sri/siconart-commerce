"use client";

import { FormEvent, useState } from "react";
import type { TrackResult } from "@/lib/yuntrack-shared";

export function ParcelTracking({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setResult(null);
    setFallbackUrl("");
    try {
      const response = await fetch(`/api/track?code=${encodeURIComponent(code.trim())}`);
      const payload = (await response.json()) as { ok?: boolean; result?: TrackResult; error?: string; url?: string };
      if (!response.ok || !payload.result) {
        setFallbackUrl(payload.url || "");
        throw new Error(payload.error || "Unable to track this parcel");
      }
      setResult(payload.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to track this parcel");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <p className="eyebrow">Shipping</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold">Parcel tracking</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">
        Enter the YunExpress tracking number from your shipping email. Sicon Art looks up the latest scans and also links
        you to the carrier page.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="min-w-0 flex-1 text-sm font-semibold">
          Tracking number
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="YT2628500708994071"
            className="mt-2 h-12 w-full rounded-[0.5rem] border bg-background px-3 text-base"
            required
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="h-12 rounded-[0.5rem] bg-primary px-5 text-sm font-semibold text-primary-foreground sm:mt-7"
        >
          {busy ? "Checking…" : "Track parcel"}
        </button>
      </form>
      {error ? <p className="mt-4 rounded-[0.5rem] border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {fallbackUrl ? (
        <a href={fallbackUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-primary">
          Open this number on YunExpress
        </a>
      ) : null}
      {result ? (
        <div className="mt-8 rounded-[0.5rem] border bg-surface p-5">
          <p className="font-serif text-2xl font-semibold">{result.code}</p>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {result.destination ? `Destination ${result.destination}` : "YunExpress"}
            {result.lastMileCarrier ? ` · Last mile ${result.lastMileCarrier}` : ""}
            {result.lastMileNumber ? ` · ${result.lastMileNumber}` : ""}
          </p>
          <ol className="mt-5 grid gap-4">
            {result.events.map((event, index) => (
              <li key={`${event.at}-${event.content}-${index}`} className="border-l-2 border-primary/40 pl-4">
                <p className="text-sm font-semibold">{event.content}</p>
                <p className="text-sm text-muted-foreground">
                  {[event.at, event.location].filter(Boolean).join(" · ")}
                </p>
              </li>
            ))}
          </ol>
          <a href={result.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-semibold text-primary">
            View on YunExpress
          </a>
        </div>
      ) : null}
    </div>
  );
}
