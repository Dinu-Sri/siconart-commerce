// Abandoned-checkout sequences commonly use 1h / 24h / 72h. Unlock at 3 days so same-day PayHere retries are not nagged.
export const UNPAID_REMINDER_WAIT_MS = 3 * 24 * 60 * 60 * 1000;
export const RECOVERY_PERCENT = 7;
export const RECOVERY_HOURS = 48;
export const RECOVERY_KIND = "unpaid-recovery";

export type ReminderDraft = {
  orderNumber: string;
  to: string;
  firstName: string;
  subject: string;
  html: string;
  code: string;
  percent: number;
  saveCents: number;
  saveLabel: string;
  expiresAt: string;
  checkoutUrl: string;
  itemNames: string[];
};

export function firstNameFrom(fullName: string) {
  const token = fullName.trim().split(/\s+/)[0] || "there";
  return token;
}

export function recoveryUnlockAt(createdAt: Date | string) {
  return new Date(new Date(createdAt).getTime() + UNPAID_REMINDER_WAIT_MS);
}

export function hoursUntilUnlock(createdAt: Date | string, now = new Date()) {
  return Math.max(0, (recoveryUnlockAt(createdAt).getTime() - now.getTime()) / 3_600_000);
}

export function reminderButtonState(
  order: {
    id: string;
    email: string;
    paymentStatus: string;
    createdAt: Date | string;
    recoverySentAt: Date | string | null;
    recoveryCode?: string | null;
  },
  siblings: Array<{ id: string; email: string; recoverySentAt: Date | string | null }>
) {
  if (order.paymentStatus === "PAID") {
    return { canSend: false, label: "", reason: "" };
  }
  const email = order.email.trim().toLowerCase();
  const already =
    Boolean(order.recoverySentAt) ||
    siblings.some((row) => row.id !== order.id && row.email.trim().toLowerCase() === email && row.recoverySentAt);
  if (already) {
    return { canSend: false, label: "Sent", reason: "A lucky 7% reminder was already sent to this customer." };
  }
  const remainingHours = hoursUntilUnlock(order.createdAt);
  if (remainingHours > 0) {
    const hours = Math.ceil(remainingHours);
    return {
      canSend: false,
      label: hours >= 24 ? `In ${Math.ceil(hours / 24)}d` : `In ${hours}h`,
      reason: `Unlocks 3 days after checkout (${hours} hour${hours === 1 ? "" : "s"} left).`
    };
  }
  return { canSend: true, label: "Send 7%", reason: "" };
}
