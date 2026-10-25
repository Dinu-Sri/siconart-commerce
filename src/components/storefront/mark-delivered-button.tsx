"use client";

import { useState } from "react";
import { formatListDate } from "@/lib/list-order-format";

type FeedbackLinkDraft = {
  orderNumber: string;
  email: string;
  customerName: string;
  url: string;
  message: string;
  deliveredAt: string;
  status: string;
};

export function MarkDeliveredButton({
  orderNumber,
  email,
  deliveredAt,
  onDelivered
}: {
  orderNumber: string;
  email: string;
  deliveredAt: string | null;
  onDelivered?: (draft: FeedbackLinkDraft) => void;
}) {
  const [markedAt, setMarkedAt] = useState(deliveredAt);
  const [step, setStep] = useState<"confirm" | "link" | null>(null);
  const [draft, setDraft] = useState<FeedbackLinkDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState("");

  async function mark(confirm: boolean) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/list/orders/${encodeURIComponent(orderNumber)}/deliver`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm })
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; draft?: FeedbackLinkDraft };
      if (!response.ok || !payload.draft) throw new Error(payload.error || "Could not open the feedback link.");
      setDraft(payload.draft);
      setMarkedAt(payload.draft.deliveredAt);
      setStep("link");
      setCopied(false);
      setSent("");
      onDelivered?.(payload.draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the feedback link.");
    } finally {
      setBusy(false);
    }
  }

  async function copyMessage() {
    if (!draft) return;
    setError("");
    try {
      await navigator.clipboard.writeText(draft.message);
      setCopied(true);
    } catch {
      setCopied(false);
      setError("Copy did not work on this phone. Select the message below and copy it.");
    }
  }

  async function sendEmail() {
    setBusy(true);
    setError("");
    setSent("");
    try {
      const response = await fetch(`/api/list/orders/${encodeURIComponent(orderNumber)}/feedback-email`, {
        method: "POST",
        credentials: "include"
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Could not send the email.");
      setSent(`Email sent to ${email}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setError("");
          setCopied(false);
          setSent("");
          if (markedAt) {
            setStep("link");
            void mark(false);
          } else setStep("confirm");
        }}
        className="mt-2 inline-flex w-full items-center justify-center rounded-[0.5rem] border border-[#a67146] bg-white px-3 py-2.5 text-sm font-semibold text-[#8b5d3a] disabled:opacity-60"
      >
        Mark delivered
      </button>
      {markedAt ? (
        <p className="mt-1 text-center text-[11px] font-semibold text-[#8a6d56]">Delivered {formatListDate(markedAt)}. Tap again for the link.</p>
      ) : null}

      {step ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) setStep(null);
          }}
        >
          <div className="w-full max-w-lg rounded-[1rem] bg-white p-4 shadow-2xl sm:p-5">
            {step === "confirm" ? (
              <>
                <h2 className="font-serif text-xl font-semibold">Mark as delivered?</h2>
                <p className="mt-2 text-sm leading-6 text-[#6d4b32]">
                  Are you sure order {orderNumber} is delivered? After you confirm, you get a short link to send the customer.
                </p>
                {error ? <ErrorNote message={error} /> : null}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setStep(null)}
                    className="rounded-[0.5rem] border border-[#ead9c3] px-4 py-3 text-sm font-semibold text-[#6d4b32]"
                  >
                    Not yet
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void mark(true)}
                    className="rounded-[0.5rem] bg-[#a67146] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {busy ? "Saving…" : "Yes, it's delivered"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-serif text-xl font-semibold">Feedback link</h2>
                <p className="mt-1 text-sm text-[#8a6d56]">
                  {draft?.customerName || "Customer"} · {email}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#6d4b32]">
                  Copy this message and send it on WhatsApp, or email it to the customer.
                </p>
                {!draft && !error ? <p className="mt-3 text-sm font-semibold text-[#8a6d56]">Preparing the link…</p> : null}
                <textarea
                  readOnly
                  value={draft?.message || ""}
                  className="mt-3 min-h-36 w-full rounded-[0.5rem] border border-[#ead9c3] bg-[#fef9ef] px-3 py-3 text-base leading-6 text-[#2f2118]"
                />
                {sent ? <p className="mt-3 text-sm font-semibold text-[#1f7a46]">{sent}</p> : null}
                {copied ? <p className="mt-3 text-sm font-semibold text-[#1f7a46]">Copied. Paste it into WhatsApp.</p> : null}
                {error ? <ErrorNote message={error} /> : null}
                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    disabled={busy || !draft}
                    onClick={() => void copyMessage()}
                    className="rounded-[0.5rem] bg-[#a67146] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    Copy message
                  </button>
                  <button
                    type="button"
                    disabled={busy || !draft}
                    onClick={() => void sendEmail()}
                    className="rounded-[0.5rem] border border-[#a67146] bg-white px-4 py-3 text-sm font-semibold text-[#8b5d3a] disabled:opacity-60"
                  >
                    {busy ? "Sending…" : "Send email"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setStep(null)}
                    className="rounded-[0.5rem] border border-[#ead9c3] px-4 py-3 text-sm font-semibold text-[#6d4b32]"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <p className="mt-3 rounded-[0.5rem] border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">{message}</p>
  );
}
