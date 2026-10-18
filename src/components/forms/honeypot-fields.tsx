import { FORM_STARTED_FIELD, HONEYPOT_FIELD } from "@/lib/form-guard";

export function HoneypotFields({ startedAt = Date.now() }: { startedAt?: number }) {
  return (
    <div className="hp-field" aria-hidden="true">
      <label>
        Website
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
      <input type="hidden" name={FORM_STARTED_FIELD} value={String(startedAt)} />
    </div>
  );
}
