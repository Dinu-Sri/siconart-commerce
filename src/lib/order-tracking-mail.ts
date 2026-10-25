import { db } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/email";
import { buildTrackingEmail } from "@/lib/tracking-email";

function firstNameFrom(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "there";
}

export async function previewTrackingEmail(orderNumber: string, trackingNumber: string) {
  const order = await loadPaidOrder(orderNumber);
  const code = trackingNumber.trim().toUpperCase();
  if (!/^[A-Z0-9-]{6,40}$/.test(code)) throw new Error("Enter the YunExpress tracking number.");
  const firstName = firstNameFrom(order.customer?.name || order.shippingAddress?.name || "there");
  const built = buildTrackingEmail({ firstName, orderNumber: order.orderNumber, trackingNumber: code });
  return { to: order.email, firstName, trackingNumber: code, subject: built.subject, html: built.html };
}

export async function sendTrackingEmail(orderNumber: string, trackingNumber: string) {
  const draft = await previewTrackingEmail(orderNumber, trackingNumber);
  const sent = await sendTransactionalEmail({
    subject: draft.subject,
    html: draft.html,
    toCustomer: draft.to,
    audience: "customer"
  });
  if (!sent.ok) throw new Error(sent.error || "Email could not be sent. Check RESEND_API_KEY.");
  await db.order.update({
    where: { orderNumber },
    data: { trackingNumber: draft.trackingNumber, trackingSentAt: new Date() }
  });
  await sendTransactionalEmail({
    subject: `[Copy] ${draft.subject}`,
    html: draft.html,
    audience: "admins"
  });
  return draft;
}

async function loadPaidOrder(orderNumber: string) {
  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { customer: true, shippingAddress: true }
  });
  if (!order) throw new Error("Order not found.");
  if (order.paymentStatus !== "PAID") throw new Error("Add tracking after the order is paid.");
  return order;
}
