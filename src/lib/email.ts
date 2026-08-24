import { SITE_NAME, SUPPORT_EMAIL, SUPPORT_WHATSAPP_DISPLAY, SUPPORT_WHATSAPP_LINK } from "@/lib/support";

type MailInput = {
  subject: string;
  html: string;
  replyTo?: string;
  toCustomer?: string;
  audience?: "admins" | "customer" | "both";
};

export type EmailKind =
  | "contact-admin"
  | "contact-customer"
  | "agent-admin"
  | "agent-customer"
  | "order-pending"
  | "order-paid-admin"
  | "order-paid-customer"
  | "order-failed";

function notifyEmails() {
  return [process.env.NOTIFY_EMAIL_1, process.env.NOTIFY_EMAIL_2]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
}

function fromAddress() {
  return process.env.RESEND_FROM?.trim() || `${SITE_NAME} <beth.t@example.com>`;
}

function siteUrl() {
  return (process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://siconart.com").replace(/\/$/, "");
}

function logoUrl(origin?: string) {
  return `${(origin || siteUrl()).replace(/\/$/, "")}/brand/siconart-logo-pdf.jpg`;
}

function paragraph(html: string) {
  return `<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#523A27;">${html}</p>`;
}

function whatsappButton() {
  return `<a href="${SUPPORT_WHATSAPP_LINK}" style="display:inline-block;margin:4px 0 12px;padding:12px 22px;background:#A67146;color:#ffffff;text-decoration:none;border-radius:999px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;line-height:1;">WhatsApp ${SUPPORT_WHATSAPP_DISPLAY}</a>`;
}

export function money(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

async function sendResend(to: string[], subject: string, html: string, replyTo?: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || to.length === 0) {
    return { ok: false, error: "Missing RESEND_API_KEY or recipients" };
  }

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
    return { ok: false, error: detail || `Resend ${response.status}` };
  }

  return { ok: true };
}

export async function sendTransactionalEmail({ subject, html, replyTo, toCustomer, audience: audienceMode }: MailInput) {
  try {
    const admins = notifyEmails();
    const audience = audienceMode ?? "both";
    if (!process.env.RESEND_API_KEY?.trim()) {
      console.warn("Email skipped: set RESEND_API_KEY plus NOTIFY_EMAIL_1 and/or NOTIFY_EMAIL_2");
      return { ok: false, error: "Email is not configured" };
    }

    if (audience !== "customer") {
      if (admins.length === 0) return { ok: false, error: "NOTIFY_EMAIL_1 / NOTIFY_EMAIL_2 are not set" };
      const adminResult = await sendResend(admins, subject, html, replyTo);
      if (!adminResult.ok) return adminResult;
    }
    if ((audience === "customer" || audience === "both") && toCustomer && !admins.includes(toCustomer)) {
      const customerResult = await sendResend([toCustomer], subject, html);
      if (!customerResult.ok) return customerResult;
    }
    return { ok: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Email send failed" };
  }
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function emailLayout(title: string, body: string, origin?: string) {
  const intro = escapeHtml(title);
  const home = (origin || siteUrl()).replace(/\/$/, "");
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#FEF9EF;color:#523A27;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FEF9EF;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
            <tr>
              <td style="background:#ffffff;border:1px solid #ead9c3;border-radius:16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding:28px 32px 18px;">
                      <img src="${logoUrl(origin)}" alt="${SITE_NAME}" width="168" style="display:block;width:168px;max-width:70%;height:auto;border:0;" />
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 32px 8px;">
                      <div style="height:1px;background:#ead9c3;line-height:1px;font-size:1px;">&nbsp;</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:22px 32px 32px;">
                      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#A67146;">${SITE_NAME}</p>
                      <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;font-weight:600;color:#523A27;">${intro}</h1>
                      ${body}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:28px 8px 4px;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#8B7355;">
                <p style="margin:0 0 12px;">Questions about an order? Message us on WhatsApp.</p>
                ${whatsappButton()}
                <p style="margin:8px 0 0;">
                  <a href="mailto:${SUPPORT_EMAIL}" style="color:#A67146;text-decoration:none;">${SUPPORT_EMAIL}</a>
                </p>
                <p style="margin:4px 0 0;">
                  <a href="${home}" style="color:#8B7355;text-decoration:none;">siconart.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function rows(entries: Array<[string, string]>) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${entries
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:0 0 14px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#523A27;">
            <span style="display:block;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#A67146;margin-bottom:4px;">${escapeHtml(label)}</span>
            ${escapeHtml(value).replaceAll("\n", "<br>")}
          </td>
        </tr>`
    )
    .join("")}</table>`;
}

function orderBody(input: OrderEmailInput) {
  const itemRows = input.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0e4d4;font-family:Arial,sans-serif;font-size:14px;color:#523A27;">
            ${escapeHtml(item.name)}<br>
            <span style="color:#8B7355;font-size:12px;">${escapeHtml(item.sku)} · qty ${item.quantity}</span>
          </td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #f0e4d4;font-family:Arial,sans-serif;font-size:14px;color:#523A27;white-space:nowrap;">${money(item.totalCents, input.currency)}</td>
        </tr>`
    )
    .join("");
  const shipping = input.shipping
    ? [
        input.shipping.name,
        input.shipping.line1,
        input.shipping.line2,
        `${input.shipping.city}${input.shipping.region ? `, ${input.shipping.region}` : ""} ${input.shipping.postalCode || ""}`.trim(),
        input.shipping.country,
        input.shipping.phone
      ]
        .filter(Boolean)
        .join("\n")
    : "-";

  return `
    ${rows([
      ["Order", input.orderNumber],
      ["Status", input.status],
      ["Customer", input.email],
      ["Discount", input.discountCode || "None"],
      ["Shipping", input.shippingCents != null ? money(input.shippingCents, input.currency) : "Included in total"],
      ["Ship to", shipping]
    ])}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      ${itemRows}
      <tr>
        <td style="padding:16px 0 0;font-family:Georgia,serif;font-size:18px;color:#523A27;">Total</td>
        <td align="right" style="padding:16px 0 0;font-family:Georgia,serif;font-size:18px;color:#523A27;">${money(input.totalCents, input.currency)}</td>
      </tr>
    </table>`;
}

type ContactInput = { name: string; email: string; subject: string; message: string };
type AgentInput = { name: string; email: string; country?: string; company?: string; message: string };
type OrderEmailInput = {
  title: string;
  subject: string;
  orderNumber: string;
  email: string;
  status: string;
  totalCents: number;
  shippingCents?: number;
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
};

const sampleOrder: OrderEmailInput = {
  title: "Payment received",
  subject: "Payment received for SA-TEST-1001",
  orderNumber: "SA-TEST-1001",
  email: "artist@example.com",
  status: "Paid",
  totalCents: 12600,
  shippingCents: 1100,
  currency: "USD",
  discountCode: "WELCOME10",
  items: [
    { name: "Chi Ling Travel Brush", sku: "SA-14", quantity: 2, totalCents: 2400 },
    { name: "SuHan Brush - M", sku: "SA-32-M", quantity: 1, totalCents: 2600 }
  ],
  shipping: {
    name: "Jane Artist",
    line1: "18 Studio Lane",
    city: "Hong Kong",
    country: "Hong Kong",
    phone: "+852 5555 0100"
  }
};

const sampleContact: ContactInput = {
  name: "Jane Artist",
  email: "artist@example.com",
  subject: "Help choosing a travel brush",
  message: "I paint urban sketches on the go. Which travel brush would you recommend for line and wash?"
};

const sampleAgent: AgentInput = {
  name: "Lee Gallery",
  email: "lee@example.com",
  country: "Singapore",
  company: "Lee Fine Art",
  message: "We would like to stock Sicon Art brushes for our watercolor workshops."
};

export const emailCatalog: Record<EmailKind, { label: string; subject: string; html: (origin?: string) => string }> = {
  "contact-admin": {
    label: "Contact form (admin)",
    subject: `New contact message: ${sampleContact.subject}`,
    html: (origin) =>
      emailLayout(
        "New contact message",
        rows([
          ["Name", sampleContact.name],
          ["Email", sampleContact.email],
          ["Subject", sampleContact.subject],
          ["Message", sampleContact.message]
        ]),
        origin
      )
  },
  "contact-customer": {
    label: "Contact form (customer)",
    subject: "We received your message",
    html: (origin) =>
      emailLayout(
        "Thank you for writing",
        paragraph(`We received your note about <strong>${escapeHtml(sampleContact.subject)}</strong> and will reply soon.`) +
          rows([["Your message", sampleContact.message]]),
        origin
      )
  },
  "agent-admin": {
    label: "Agent request (admin)",
    subject: `New agent request from ${sampleAgent.name}`,
    html: (origin) =>
      emailLayout(
        "New agent request",
        rows([
          ["Name", sampleAgent.name],
          ["Email", sampleAgent.email],
          ["Country", sampleAgent.country || "-"],
          ["Company", sampleAgent.company || "-"],
          ["Message", sampleAgent.message]
        ]),
        origin
      )
  },
  "agent-customer": {
    label: "Agent request (customer)",
    subject: "We received your agent request",
    html: (origin) =>
      emailLayout(
        "Thank you for your interest",
        paragraph("We received your request to become a Sicon Art agent and will be in touch with next steps."),
        origin
      )
  },
  "order-pending": {
    label: "New order, pending payment",
    subject: `New Sicon Art order ${sampleOrder.orderNumber} (pending payment)`,
    html: (origin) => emailLayout("New order placed", orderBody({ ...sampleOrder, status: "Pending payment" }), origin)
  },
  "order-paid-admin": {
    label: "Payment received (admin)",
    subject: `Payment received for ${sampleOrder.orderNumber}`,
    html: (origin) => emailLayout("Payment received", orderBody(sampleOrder), origin)
  },
  "order-paid-customer": {
    label: "Payment received (customer)",
    subject: `Your Sicon Art order ${sampleOrder.orderNumber}`,
    html: (origin) =>
      emailLayout(
        "Thank you for your order",
        paragraph(
          `We have received payment for order <strong>${escapeHtml(sampleOrder.orderNumber)}</strong>. We will pack it with care and share tracking when it ships.`
        ) + orderBody(sampleOrder),
        origin
      )
  },
  "order-failed": {
    label: "Payment failed (admin)",
    subject: `Payment failed for ${sampleOrder.orderNumber}`,
    html: (origin) => emailLayout("Payment failed", orderBody({ ...sampleOrder, status: "Payment failed" }), origin)
  }
};

export async function notifyContactSubmission(input: ContactInput) {
  await sendTransactionalEmail({
    subject: `New contact message: ${input.subject}`,
    html: emailLayout(
      "New contact message",
      rows([
        ["Name", input.name],
        ["Email", input.email],
        ["Subject", input.subject],
        ["Message", input.message]
      ])
    ),
    replyTo: input.email,
    audience: "admins"
  });
  await sendTransactionalEmail({
    subject: "We received your message",
    html: emailLayout(
      "Thank you for writing",
      paragraph(`We received your note about <strong>${escapeHtml(input.subject)}</strong> and will reply soon.`) +
        rows([["Your message", input.message]])
    ),
    toCustomer: input.email,
    audience: "customer"
  });
}

export async function notifyAgentLead(input: AgentInput) {
  await sendTransactionalEmail({
    subject: `New agent request from ${input.name}`,
    html: emailLayout(
      "New agent request",
      rows([
        ["Name", input.name],
        ["Email", input.email],
        ["Country", input.country || "-"],
        ["Company", input.company || "-"],
        ["Message", input.message]
      ])
    ),
    replyTo: input.email,
    audience: "admins"
  });
  await sendTransactionalEmail({
    subject: "We received your agent request",
    html: emailLayout(
      "Thank you for your interest",
      paragraph("We received your request to become a Sicon Art agent and will be in touch with next steps.")
    ),
    toCustomer: input.email,
    audience: "customer"
  });
}

export async function notifyOrder(input: OrderEmailInput) {
  const paid = input.notifyCustomer;
  const failed = input.status.toLowerCase().includes("fail");
  const title = paid ? "Payment received" : failed ? "Payment failed" : "New order placed";
  await sendTransactionalEmail({
    subject: input.subject,
    html: emailLayout(title, orderBody(input)),
    replyTo: input.email,
    audience: "admins"
  });
  if (paid) {
    await sendTransactionalEmail({
      subject: `Your Sicon Art order ${input.orderNumber}`,
      html: emailLayout(
        "Thank you for your order",
        paragraph(
          `We have received payment for order <strong>${escapeHtml(input.orderNumber)}</strong>. We will pack it with care and share tracking when it ships.`
        ) + orderBody(input)
      ),
      toCustomer: input.email,
      audience: "customer"
    });
  }
}

export async function sendTestEmails(kind?: EmailKind) {
  const admins = notifyEmails();
  const kinds = kind ? [kind] : (Object.keys(emailCatalog) as EmailKind[]);
  const results: Array<{ kind: EmailKind; ok: boolean; error?: string }> = [];

  for (const current of kinds) {
    const template = emailCatalog[current];
    const result = await sendTransactionalEmail({
      subject: `[TEST] ${template.subject}`,
      html: template.html()
    });
    results.push({ kind: current, ok: result.ok, error: result.error });
  }

  return { recipients: admins, results };
}
