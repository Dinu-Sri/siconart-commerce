"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { unlockListAccess } from "@/lib/price-list-sync-client";
import { HoneypotFields } from "@/components/forms/honeypot-fields";
import { FORM_STARTED_FIELD, HONEYPOT_FIELD, isBotSubmission } from "@/lib/form-guard";

export function ListUnlock() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (isBotSubmission({ honeypot: formData.get(HONEYPOT_FIELD), startedAt: formData.get(FORM_STARTED_FIELD) })) {
      setError("Password is incorrect.");
      return;
    }
    setSubmitting(true);
    setError("");
    const result = await unlockListAccess(password, {
      website: String(formData.get(HONEYPOT_FIELD) || ""),
      formStarted: String(formData.get(FORM_STARTED_FIELD) || "")
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error.detail || "Password is incorrect.");
      return;
    }
    router.refresh();
  }

  return (
    <section
      className="flex min-h-dvh items-center justify-center bg-[#fef9ef] px-4 py-10 text-[#2f2118]"
      style={{ colorScheme: "light" }}
    >
      <form onSubmit={onSubmit} className="relative w-full max-w-sm rounded-[0.5rem] border border-[#ead9c3] bg-white p-5 shadow-sm sm:p-6">
        <HoneypotFields />
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#a67146] text-white">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a67146]">Private list</p>
            <h1 className="font-serif text-2xl font-semibold">Price List Access</h1>
          </div>
        </div>

        <label className="text-sm font-semibold text-[#6d4b32]">
          Password
          <input
            autoFocus
            required
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-[0.5rem] border border-[#ead9c3] bg-[#fef9ef] px-3 py-3 text-base text-[#2f2118] outline-none transition focus:border-[#a67146]"
            placeholder="Enter password"
          />
        </label>

        {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}

        <Button type="submit" disabled={submitting} className="mt-5 w-full bg-[#a67146] text-white hover:bg-[#8b5d3a]">
          {submitting ? "Opening…" : "Open list"}
        </Button>
      </form>
    </section>
  );
}
