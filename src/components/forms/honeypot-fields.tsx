"use client";

import { useState } from "react";
import { FORM_STARTED_FIELD, HONEYPOT_FIELD } from "@/lib/form-guard";

export function HoneypotFields() {
  const [startedAt] = useState(() => Date.now());

  return (
    <div className="hp-field" aria-hidden="true">
      <label>
        Company fax
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
      <input type="hidden" name={FORM_STARTED_FIELD} defaultValue={String(startedAt)} />
    </div>
  );
}
