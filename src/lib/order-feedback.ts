import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { emailLayout, escapeHtml, paragraph, sendTransactionalEmail } from "@/lib/email";
import { absoluteUrl } from "@/lib/site-origin";
import { FEEDBACK_THANKS, feedbackPath, feedbackRequestMessage, isFeedbackToken } from "@/lib/order-feedback-message";
import type { FeedbackLinkDraft, ListFeedbackRow, PublicFeedbackForm, PublicProductFeedback } from "@/lib/order-feedback-types";

export type { FeedbackLinkDraft, ListFeedbackRow, PublicFeedbackForm, PublicProductFeedback };

const MAX_PHOTOS = 4;
const MAX_PHOTO_BYTES = 1_500_000;
const MIN_BODY = 8;
const MAX_BODY = 2000;

type PhotoInput = {
  bytes: Uint8Array;
  contentType: string;
};

function customerNameFrom(order: {
  customer: { name: string | null } | null;
  shippingAddress: { name: string } | null;
}) {
  const name = order.shippingAddress?.name?.trim() || order.customer?.name?.trim() || "";
  return name || "Customer";
}

function isUniqueError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002";
}

function newToken() {
  return randomBytes(12).toString("base64url");
}

function draftFrom(order: {
  orderNumber: string;
  email: string;
  status: string;
  deliveredAt: Date | null;
  customer: { name: string | null } | null;
  shippingAddress: { name: string } | null;
  feedbackInvite: { token: string } | null;
}): FeedbackLinkDraft {
  if (!order.feedbackInvite || !order.deliveredAt) throw new Error("Could not prepare the feedback link.");
  const url = absoluteUrl(feedbackPath(order.feedbackInvite.token));
  return {
    orderNumber: order.orderNumber,
    email: order.email,
    customerName: customerNameFrom(order),
    url,
    message: feedbackRequestMessage(url),
    deliveredAt: order.deliveredAt.toISOString(),
    status: order.status
  };
}

async function loadOrder(orderNumber: string) {
  return db.order.findUnique({
    where: { orderNumber },
    include: {
      customer: true,
      shippingAddress: true,
      feedbackInvite: true,
      items: { select: { productId: true, name: true } }
    }
  });
}

async function ensureInvite(orderId: string) {
  const existing = await db.orderFeedbackInvite.findUnique({ where: { orderId } });
  if (existing) return existing;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await db.orderFeedbackInvite.create({ data: { orderId, token: newToken() } });
    } catch (error) {
      if (!isUniqueError(error)) throw error;
      const again = await db.orderFeedbackInvite.findUnique({ where: { orderId } });
      if (again) return again;
    }
  }
  throw new Error("Could not create the feedback link. Try again.");
}

export async function markOrderDelivered(orderNumber: string, confirm: boolean) {
  const order = await loadOrder(orderNumber);
  if (!order) throw new Error("Order not found.");
  if (order.paymentStatus !== "PAID") throw new Error("Mark delivered only after the order is paid.");
  if (!order.deliveredAt && !confirm) throw new Error("Confirm that the order is delivered first.");

  const invite = order.feedbackInvite ?? (await ensureInvite(order.id));
  const nextStatus = order.status === "PENDING" || order.status === "PAID" ? "FULFILLED" : order.status;
  const saved = await db.order.update({
    where: { id: order.id },
    data: {
      deliveredAt: order.deliveredAt ?? new Date(),
      status: nextStatus
    },
    include: { customer: true, shippingAddress: true, feedbackInvite: true }
  });
  return draftFrom({ ...saved, feedbackInvite: saved.feedbackInvite ?? invite });
}

export async function sendFeedbackRequestEmail(orderNumber: string) {
  const order = await loadOrder(orderNumber);
  if (!order) throw new Error("Order not found.");
  if (order.paymentStatus !== "PAID") throw new Error("Send the feedback email after the order is paid.");
  if (!order.deliveredAt || !order.feedbackInvite) throw new Error("Mark the order delivered before sending the email.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)) throw new Error("This order has no usable email address.");

  const draft = draftFrom(order);
  const html = emailLayout(
    "Thank you for choosing Sicon Art",
    [
      paragraph(escapeHtml(FEEDBACK_THANKS)),
      `<p style="margin:0 0 16px;"><a href="${escapeHtml(draft.url)}" style="display:inline-block;padding:12px 22px;background:#A67146;color:#ffffff;text-decoration:none;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">Share your feedback</a></p>`,
      paragraph(`Or open this link:<br><a href="${escapeHtml(draft.url)}" style="color:#A67146;">${escapeHtml(draft.url)}</a>`)
    ].join("")
  );
  const sent = await sendTransactionalEmail({
    subject: "Thank you for choosing Sicon Art",
    html,
    toCustomer: draft.email,
    audience: "customer"
  });
  if (!sent.ok) throw new Error(sent.error || "Email could not be sent. Check RESEND_API_KEY.");
  await sendTransactionalEmail({
    subject: `[Copy] Thank you for choosing Sicon Art`,
    html,
    audience: "admins"
  });
  return draft;
}

export async function getPublicFeedbackForm(token: string): Promise<PublicFeedbackForm | "unavailable" | null> {
  if (!isFeedbackToken(token)) return null;
  try {
    const invite = await db.orderFeedbackInvite.findUnique({
      where: { token },
      include: {
        order: {
          include: {
            customer: true,
            shippingAddress: true,
            items: { select: { name: true } },
            feedbacks: { select: { id: true }, take: 1 }
          }
        }
      }
    });
    if (!invite) return null;
    return {
      orderNumber: invite.order.orderNumber,
      customerName: customerNameFrom(invite.order),
      products: [...new Set(invite.order.items.map((item) => item.name))],
      submitted: invite.order.feedbacks.length > 0
    };
  } catch (error) {
    console.error("Feedback form lookup failed:", error);
    return "unavailable";
  }
}

export function inspectFeedbackPhoto(bytes: Uint8Array) {
  if (bytes.byteLength > MAX_PHOTO_BYTES) return { error: "Each photo must be under 1.5 MB." as const };
  const contentType = detectImageType(bytes);
  if (!contentType) return { error: "Use a JPG, PNG, or WebP photo." as const };
  return { contentType };
}

function detectImageType(bytes: Uint8Array) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export async function submitOrderFeedback(token: string, body: string, photos: PhotoInput[], honeypot: string) {
  if (!isFeedbackToken(token)) throw new Error("This feedback link is not valid.");
  if (honeypot.trim()) return { ok: true as const };

  const text = body.replace(/\u0000/g, "").trim();
  if (text.length < MIN_BODY) throw new Error("Please write a short note about your order.");
  if (text.length > MAX_BODY) throw new Error("Please keep the feedback under 2000 characters.");
  if (photos.length > MAX_PHOTOS) throw new Error("You can add up to 4 photos.");

  const images = photos.map((photo) => {
    const checked = inspectFeedbackPhoto(photo.bytes);
    if ("error" in checked) throw new Error(checked.error);
    return { bytes: Buffer.from(photo.bytes), contentType: checked.contentType };
  });

  const invite = await db.orderFeedbackInvite.findUnique({
    where: { token },
    include: {
      order: {
        include: {
          customer: true,
          shippingAddress: true,
          items: { select: { productId: true } },
          feedbacks: { select: { id: true }, take: 1 }
        }
      }
    }
  });
  if (!invite) throw new Error("This feedback link is not valid.");
  if (invite.order.feedbacks.length > 0) throw new Error("We already have your feedback for this order.");

  const productIds = [...new Set(invite.order.items.map((item) => item.productId))];
  const products = productIds.length
    ? await db.product.findMany({ where: { id: { in: productIds } }, select: { id: true } })
    : [];

  try {
    await db.orderFeedback.create({
      data: {
        orderId: invite.orderId,
        customerName: customerNameFrom(invite.order),
        email: invite.order.email,
        body: text,
        ...(images.length
          ? {
              images: {
                create: images.map((image) => ({
                  contentType: image.contentType,
                  bytes: image.bytes
                }))
              }
            }
          : {}),
        ...(products.length
          ? {
              products: {
                create: products.map((product) => ({ productId: product.id }))
              }
            }
          : {})
      }
    });
  } catch (error) {
    if (isUniqueError(error)) throw new Error("We already have your feedback for this order.");
    console.error("Feedback save failed:", error);
    throw new Error("We could not save your feedback. Please try again.");
  }

  return { ok: true as const };
}

export async function listOrderFeedbacks(): Promise<{ rows: ListFeedbackRow[]; error: string | null }> {
  try {
    const rows = await db.orderFeedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        order: { select: { orderNumber: true } },
        images: { select: { id: true }, orderBy: { createdAt: "asc" } },
        products: { include: { product: { select: { name: true, slug: true } } } }
      }
    });
    return {
      error: null,
      rows: rows.map((row) => ({
        id: row.id,
        orderNumber: row.order.orderNumber,
        customerName: row.customerName,
        email: row.email,
        body: row.body,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        decidedAt: row.decidedAt?.toISOString() ?? null,
        products: row.products.map((link) => ({ name: link.product.name, slug: link.product.slug })),
        imageIds: row.images.map((image) => image.id)
      }))
    };
  } catch (error) {
    console.error("Feedback list failed:", error);
    return { rows: [], error: "Could not load feedbacks. Refresh the page. If this stays, the database update may still be running." };
  }
}

export async function setOrderFeedbackStatus(id: string, status: "APPROVED" | "SUSPENDED") {
  try {
    const row = await db.orderFeedback.update({
      where: { id },
      data: { status, decidedAt: new Date() },
      select: { id: true, status: true, decidedAt: true }
    });
    return {
      id: row.id,
      status: row.status,
      decidedAt: row.decidedAt?.toISOString() ?? null
    };
  } catch {
    throw new Error("Feedback not found.");
  }
}

export async function getApprovedProductFeedback(slug: string): Promise<PublicProductFeedback[]> {
  try {
    const product = await db.product.findUnique({ where: { slug }, select: { id: true } });
    if (!product) return [];
    const links = await db.orderFeedbackProduct.findMany({
      where: { productId: product.id, feedback: { status: "APPROVED" } },
      include: {
        feedback: {
          select: {
            id: true,
            customerName: true,
            body: true,
            createdAt: true,
            images: { select: { id: true }, orderBy: { createdAt: "asc" } }
          }
        }
      },
      orderBy: { feedback: { createdAt: "desc" } },
      take: 24
    });
    return links.map((link) => ({
      id: link.feedback.id,
      customerName: link.feedback.customerName,
      body: link.feedback.body,
      dateLabel: new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(link.feedback.createdAt),
      imageIds: link.feedback.images.map((image) => image.id)
    }));
  } catch (error) {
    console.error("Product feedback lookup failed:", error);
    return [];
  }
}

export async function readFeedbackImage(id: string) {
  return db.orderFeedbackImage.findUnique({
    where: { id },
    include: { feedback: { select: { status: true } } }
  });
}
