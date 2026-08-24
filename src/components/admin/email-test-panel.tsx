"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { EmailKind } from "@/lib/email";

export function EmailTestPanel({ templates }: { templates: Array<{ kind: EmailKind; label: string }> }) {
  const [kind, setKind] = useState<EmailKind>(templates[0]?.kind ?? "contact-admin");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function send(which: "one" | "all") {
    setSending(true);
    setStatus("");
    try {
      const response = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: which === "all" ? "all" : kind })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to send test email");
      const failed = (payload.results as Array<{ kind: string; ok: boolean; error?: string }>).filter((item) => !item.ok);
      if (failed.length) {
        setStatus(`Sent with errors. Recipients: ${(payload.recipients || []).join(", ") || "none"}. ${failed.map((item) => `${item.kind}: ${item.error}`).join(" ")}`);
      } else {
        setStatus(`Sent to ${(payload.recipients || []).join(", ") || "configured admin inboxes"}.`);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to send test email");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-semibold">
          Template
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as EmailKind)}
            className="h-11 rounded-[0.5rem] border bg-background px-3"
          >
            {templates.map((template) => (
              <option key={template.kind} value={template.kind}>
                {template.label}
              </option>
            ))}
          </select>
        </label>
        <Button type="button" onClick={() => send("one")} disabled={sending}>
          {sending ? "Sending..." : "Send this test"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => send("all")} disabled={sending}>
          Send all tests
        </Button>
        {status && <p className="text-sm leading-6 text-muted-foreground">{status}</p>}
      </div>
      <iframe
        title="Email preview"
        src={`/api/email/preview?kind=${encodeURIComponent(kind)}`}
        className="min-h-[720px] w-full rounded-[0.5rem] border bg-white"
      />
    </div>
  );
}
