import { randomInt } from "node:crypto";
import { db } from "@/lib/db";
import { money, sendTransactionalEmail } from "@/lib/email";
import { siteOrigin } from "@/lib/site-origin";
import { buildUnpaidRecoveryEmail } from "@/lib/unpaid-recovery-email";
import {
  firstNameFrom,
  RECOVERY_HOURS,
  RECOVERY_KIND,
  RECOVERY_PERCENT,
  UNPAID_REMINDER_WAIT_MS,
  type ReminderDraft
} from "@/lib/unpaid-recovery-state";

export {
  firstNameFrom,
  reminderButtonState,
  RECOVERY_HOURS,
  RECOVERY_KIND,
  RECOVERY_PERCENT,
  UNPAID_REMINDER_WAIT_MS,
  type ReminderDraft
} from "@/lib/unpaid-recovery-state";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateLuckyCode() {
  let tail = "";
  for (let index = 0; index < 4; index += 1) {
    tail += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return `LUCKY7-${tail}`;
}

async function uniqueLuckyCode() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = generateLuckyCode();
    const exists = await db.discountCode.findUnique({ where: { code }, select: { id: true } });
    if (!exists) return code;
  }
  throw new Error("Could not allocate a discount code.");
}

export async function findEmailRecovery(email: string) {
  const normalized = email.trim().toLowerCase();
  return db.discountCode.findFirst({
    where: {
      kind: RECOVERY_KIND,
      allowedEmail: { equals: normalized, mode: "insensitive" }
    },
    orderBy: { createdAt: "desc" }
  });
}

function draftFromOrder(
  order: {
    orderNumber: string;
    email: string;
    currency: string;
    subtotalCents: number;
    shippingAddress: { name: string } | null;
    customer: { name: string | null } | null;
    items: Array<{ name: string }>;
  },
  code: string,
  expiresAt: Date
): ReminderDraft {
  const firstName = firstNameFrom(order.customer?.name || order.shippingAddress?.name || "there");
  const saveCents = Math.floor((order.subtotalCents * RECOVERY_PERCENT) / 100);
  const saveLabel = money(saveCents, order.currency);
  const checkoutUrl = `${siteOrigin()}/checkout?code=${encodeURIComponent(code)}&order=${encodeURIComponent(order.orderNumber)}`;
  const itemNames = order.items.map((item) => item.name);
  const built = buildUnpaidRecoveryEmail({
    firstName,
    orderNumber: order.orderNumber,
    code,
    percent: RECOVERY_PERCENT,
    saveLabel,
    hours: RECOVERY_HOURS,
    checkoutUrl,
    itemNames,
    expiresAt
  });
  return {
    orderNumber: order.orderNumber,
    to: order.email,
    firstName,
    subject: built.subject,
    html: built.html,
    code,
    percent: RECOVERY_PERCENT,
    saveCents,
    saveLabel,
    expiresAt: expiresAt.toISOString(),
    checkoutUrl,
    itemNames
  };
}

export async function previewUnpaidReminder(orderNumber: string): Promise<ReminderDraft> {
  const order = await loadUnpaidOrder(orderNumber);
  await assertCanSend(order);
  const existing = await findEmailRecovery(order.email);
  if (existing?.usedCount) {
    throw new Error("This customer already used a lucky 7% code.");
  }
  const expiresAt = new Date(Date.now() + RECOVERY_HOURS * 3_600_000);
  const code = existing && existing.endsAt && existing.endsAt > new Date() ? existing.code : await uniqueLuckyCode();
  return draftFromOrder(order, code, existing?.endsAt && existing.endsAt > new Date() ? existing.endsAt : expiresAt);
}

export async function sendUnpaidReminder(orderNumber: string, draftCode?: string) {
  const order = await loadUnpaidOrder(orderNumber);
  await assertCanSend(order);
  const existing = await findEmailRecovery(order.email);
  if (existing?.usedCount) {
    throw new Error("This customer already used a lucky 7% code.");
  }

  const expiresAt = existing?.endsAt && existing.endsAt > new Date()
    ? existing.endsAt
    : new Date(Date.now() + RECOVERY_HOURS * 3_600_000);
  const code = existing?.code || draftCode || (await uniqueLuckyCode());
  const draft = draftFromOrder(order, code, expiresAt);

  if (!existing) {
    await db.discountCode.create({
      data: {
        code,
        type: "percent",
        value: RECOVERY_PERCENT,
        minSubtotalCents: 0,
        active: true,
        startsAt: new Date(),
        endsAt: expiresAt,
        usageLimit: 1,
        usedCount: 0,
        kind: RECOVERY_KIND,
        allowedEmail: order.email.trim().toLowerCase(),
        sourceOrderId: order.id
      }
    });
  }

  const sent = await sendTransactionalEmail({
    subject: draft.subject,
    html: draft.html,
    toCustomer: order.email,
    audience: "customer"
  });
  if (!sent.ok) {
    throw new Error(sent.error || "Email could not be sent. Check RESEND_API_KEY.");
  }

  await db.order.update({
    where: { id: order.id },
    data: { recoveryCode: code, recoverySentAt: new Date() }
  });

  await sendTransactionalEmail({
    subject: `[Copy] ${draft.subject}`,
    html: draft.html,
    audience: "admins"
  });

  return draft;
}

export async function sendUnpaidReminderTest(to: string) {
  const email = to.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  const expiresAt = new Date(Date.now() + RECOVERY_HOURS * 3_600_000);
  const built = buildUnpaidRecoveryEmail({
    firstName: "Alex",
    orderNumber: "SA-TEST-1001",
    code: "LUCKY7-TEST",
    percent: RECOVERY_PERCENT,
    saveLabel: money(910, "USD"),
    hours: RECOVERY_HOURS,
    checkoutUrl: `${siteOrigin()}/checkout?code=LUCKY7-TEST`,
    itemNames: ["Chi Ling Travel Brush", "SuHan Brush - M"],
    expiresAt
  });
  const sent = await sendTransactionalEmail({
    subject: `[TEST] ${built.subject}`,
    html: built.html,
    toCustomer: email,
    audience: "customer"
  });
  if (!sent.ok) throw new Error(sent.error || "Test email could not be sent.");
  return { subject: `[TEST] ${built.subject}`, to: email };
}

async function loadUnpaidOrder(orderNumber: string) {
  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true, shippingAddress: true, customer: true }
  });
  if (!order) throw new Error("Order not found.");
  if (order.paymentStatus === "PAID") throw new Error("This order is already paid.");
  return order;
}

async function assertCanSend(order: { id: string; email: string; createdAt: Date; recoverySentAt: Date | null }) {
  if (order.recoverySentAt) {
    throw new Error("A reminder was already sent for this order.");
  }
  const waitMs = UNPAID_REMINDER_WAIT_MS - (Date.now() - order.createdAt.getTime());
  if (waitMs > 0) {
    const hours = Math.ceil(waitMs / 3_600_000);
    throw new Error(`Wait ${hours} more hour${hours === 1 ? "" : "s"} before sending. The button unlocks 24 hours after checkout.`);
  }
  const other = await db.order.findFirst({
    where: {
      email: { equals: order.email, mode: "insensitive" },
      recoverySentAt: { not: null },
      id: { not: order.id }
    }
  });
  if (other) {
    throw new Error("This customer already received a lucky 7% reminder.");
  }
  const used = await db.discountCode.findFirst({
    where: {
      kind: RECOVERY_KIND,
      allowedEmail: { equals: order.email.trim().toLowerCase(), mode: "insensitive" },
      usedCount: { gt: 0 }
    }
  });
  if (used) {
    throw new Error("This customer already used a lucky 7% code.");
  }
}


