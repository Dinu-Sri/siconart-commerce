type MailInput = {
  subject: string;
  html: string;
  replyTo?: string;
  toCustomer?: string;
};

function notifyEmails() {
  return [process.env.NOTIFY_EMAIL_1, process.env.NOTIFY_EMAIL_2]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
}

function fromAddress() {
  return process.env.RESEND_FROM?.trim() || "Sicon Art <beth.t@example.com>";
}

export function money(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

async function sendResend(to: string[], subject: string, html: string, replyTo?: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || to.length === 0) return;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromAddress(),
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {})
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Resend error:", response.status, detail);
  }
}

export async function sendTransactionalEmail({ subject, html, replyTo, toCustomer }: MailInput) {
  try {
    const admins = notifyEmails();
    if (!process.env.RESEND_API_KEY?.trim() || admins.length === 0) {
      console.warn("Email skipped: set RESEND_API_KEY plus NOTIFY_EMAIL_1 and/or NOTIFY_EMAIL_2");
      return;
    }

    await sendResend(admins, subject, html, replyTo);
    if (toCustomer && !admins.includes(toCustomer)) {
      await sendResend([toCustomer], subject, html);
    }
  } catch (error) {
    console.error("Email send failed:", error);
  }
}

function rows(entries: Array<[string, string]>) {
  return entries
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
    )
    .join("");
}

export async function notifyContactSubmission(input: { name: string; email: string; subject: string; message: string }) {
  const body = rows([
    ["Name", input.name],
    ["Email", input.email],
    ["Subject", input.subject],
    ["Message", input.message]
  ]);
  await sendTransactionalEmail({
    subject: `New contact message: ${input.subject}`,
    html: emailLayout("New contact message", body),
    replyTo: input.email,
    toCustomer: input.email
  });
}

export async function notifyAgentLead(input: {
  name: string;
  email: string;
  country?: string;
  company?: string;
  message: string;
}) {
  const body = rows([
    ["Name", input.name],
    ["Email", input.email],
    ["Country", input.country || "-"],
    ["Company", input.company || "-"],
    ["Message", input.message]
  ]);
  await sendTransactionalEmail({
    subject: `New agent request from ${input.name}`,
    html: emailLayout("New agent request", body),
    replyTo: input.email,
    toCustomer: input.email
  });
}

export async function notifyOrder(input: {
  title: string;
  subject: string;
  orderNumber: string;
  email: string;
  status: string;
  totalCents: number;
  currency?: string;
  discountCode?: string | null;
  items: Array<{ name: string; sku: string; quantity: number; totalCents: number }>;
  shipping?: {
    name: string;
    line1: string;
    line2?: string | null;
    city: string;
    region?: string | null;
    postalCode?: string | null;
    country: string;
    phone?: string | null;
  } | null;
  notifyCustomer?: boolean;
}) {
  const itemRows = input.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #ead9c3;font-family:Arial,sans-serif;font-size:14px;">${escapeHtml(item.name)}<br><span style="color:#8B7355;">${escapeHtml(item.sku)} x ${item.quantity}</span></td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #ead9c3;font-family:Arial,sans-serif;font-size:14px;">${money(item.totalCents, input.currency)}</td>
        </tr>`
    )
    .join("");
  const shipping = input.shipping
    ? [input.shipping.name, input.shipping.line1, input.shipping.line2, `${input.shipping.city}${input.shipping.region ? `, ${input.shipping.region}` : ""} ${input.shipping.postalCode || ""}`.trim(), input.shipping.country, input.shipping.phone]
        .filter(Boolean)
        .join(", ")
    : "-";
  const body = `
    ${rows([
      ["Order", input.orderNumber],
      ["Customer", input.email],
      ["Status", input.status],
      ["Discount", input.discountCode || "-"],
      ["Ship to", shipping]
    ])}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">${itemRows}
      <tr>
        <td style="padding:12px 0;font-family:Arial,sans-serif;font-size:16px;"><strong>Total</strong></td>
        <td align="right" style="padding:12px 0;font-family:Arial,sans-serif;font-size:16px;"><strong>${money(input.totalCents, input.currency)}</strong></td>
      </tr>
    </table>`;
  await sendTransactionalEmail({
    subject: input.subject,
    html: emailLayout(input.title, body),
    replyTo: input.email,
    toCustomer: input.notifyCustomer ? input.email : undefined
  });
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function emailLayout(title: string, body: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#FEF9EF;color:#523A27;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF9EF;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFDF7;border:1px solid #ead9c3;border-radius:8px;padding:28px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;letter-spacing:0.18em;text-transform:uppercase;font-size:11px;color:#A67146;font-family:Arial,sans-serif;">Sicon Art</p>
                <h1 style="margin:0 0 20px;font-size:26px;line-height:1.2;">${escapeHtml(title)}</h1>
                ${body}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
