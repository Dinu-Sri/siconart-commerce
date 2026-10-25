import { db } from "@/lib/db";
import { emailLayout, escapeHtml, paragraph, sendTransactionalEmail } from "@/lib/email";
import { siteOrigin } from "@/lib/site-origin";
import { mergeCartLines, normalizeCartLines, type CartLine } from "@/lib/browser-cart";
import {
  clearCustomerSession,
  generatePassword,
  hashPassword,
  hashToken,
  newResetToken,
  readCustomerSession,
  setCustomerSession,
  verifyPassword
} from "@/lib/customer-auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AccountAddress = {
  id: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  countryCode: string;
  phone: string;
  isDefault: boolean;
};

export async function getAccountSnapshot() {
  const session = await readCustomerSession();
  if (!session) return null;
  const customer = await db.customer.findUnique({
    where: { id: session.id },
    include: {
      addresses: { orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }] },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 40,
        include: { items: true }
      }
    }
  });
  if (!customer) return null;
  return {
    customer: {
      id: customer.id,
      email: customer.email,
      name: customer.name || "",
      phone: customer.phone || ""
    },
    addresses: customer.addresses.map(toAddress),
    orders: customer.orders.map((order) => ({
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      paymentStatus: order.paymentStatus,
      status: order.status,
      totalCents: order.totalCents,
      currency: order.currency,
      trackingNumber: order.trackingNumber,
      guestCheckout: order.guestCheckout,
      items: order.items.map((item) => ({ name: item.name, quantity: item.quantity }))
    })),
    lines: readStoredLines(customer.cartLines)
  };
}

export async function signupAccount(input: { email: string; password: string; name: string; lines?: unknown }) {
  const email = normalizeEmail(input.email);
  const password = input.password;
  if (!emailPattern.test(email)) throw new Error("Enter a valid email address.");
  if (password.length < 8) throw new Error("Use at least 8 characters for the password.");
  const existing = await db.customer.findUnique({ where: { email } });
  if (existing?.passwordHash) throw new Error("An account already uses this email. Log in or reset the password.");
  const lines = mergeCartLines(readStoredLines(existing?.cartLines), normalizeCartLines(input.lines));
  const customer = existing
    ? await db.customer.update({
        where: { id: existing.id },
        data: { passwordHash: hashPassword(password), name: input.name.trim() || existing.name, cartLines: lines }
      })
    : await db.customer.create({
        data: { email, name: input.name.trim() || null, passwordHash: hashPassword(password), cartLines: lines }
      });
  await setCustomerSession(customer.id);
  return { lines };
}

export async function loginAccount(input: { email: string; password: string; lines?: unknown }) {
  const email = normalizeEmail(input.email);
  const customer = await db.customer.findUnique({ where: { email } });
  if (!customer?.passwordHash || !verifyPassword(input.password, customer.passwordHash)) {
    throw new Error("Email or password is not correct.");
  }
  const lines = mergeCartLines(readStoredLines(customer.cartLines), normalizeCartLines(input.lines));
  await db.customer.update({ where: { id: customer.id }, data: { cartLines: lines } });
  await setCustomerSession(customer.id);
  return { lines };
}

export async function logoutAccount() {
  await clearCustomerSession();
}

export async function requestPasswordReset(emailRaw: string) {
  const email = normalizeEmail(emailRaw);
  if (!emailPattern.test(email)) throw new Error("Enter a valid email address.");
  const customer = await db.customer.findUnique({ where: { email } });
  if (!customer) return;
  const token = newResetToken();
  await db.customer.update({
    where: { id: customer.id },
    data: {
      resetTokenHash: hashToken(token),
      resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000)
    }
  });
  const link = `${siteOrigin()}/account/reset?token=${encodeURIComponent(token)}`;
  const sent = await sendTransactionalEmail({
    subject: "Reset your Sicon Art password",
    html: emailLayout(
      "Reset your password",
      paragraph(`We received a request to set a new password for <strong>${escapeHtml(email)}</strong>.`) +
        `<p style="margin:0 0 18px;"><a href="${link}" style="display:inline-block;padding:14px 26px;background:#A67146;color:#ffffff;text-decoration:none;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">Choose a new password</a></p>` +
        paragraph("This link closes after 1 hour. If you did not ask for it, you can ignore this email.")
    ),
    toCustomer: email,
    audience: "customer"
  });
  if (!sent.ok) throw new Error(sent.error || "The reset email could not be sent.");
}

export async function resetPassword(token: string, password: string) {
  if (password.length < 8) throw new Error("Use at least 8 characters for the password.");
  const customer = await db.customer.findFirst({ where: { resetTokenHash: hashToken(token) } });
  if (!customer?.resetTokenExpiresAt || customer.resetTokenExpiresAt.getTime() < Date.now()) {
    throw new Error("This reset link has expired. Request a new one.");
  }
  await db.customer.update({
    where: { id: customer.id },
    data: { passwordHash: hashPassword(password), resetTokenHash: null, resetTokenExpiresAt: null }
  });
  await setCustomerSession(customer.id);
}

export async function changePassword(currentPassword: string, nextPassword: string) {
  const session = await requireSession();
  const customer = await db.customer.findUnique({ where: { id: session.id } });
  if (!customer?.passwordHash || !verifyPassword(currentPassword, customer.passwordHash)) {
    throw new Error("Current password is not correct.");
  }
  if (nextPassword.length < 8) throw new Error("Use at least 8 characters for the new password.");
  await db.customer.update({ where: { id: customer.id }, data: { passwordHash: hashPassword(nextPassword) } });
}

export async function updateProfile(input: { name: string; phone: string }) {
  const session = await requireSession();
  await db.customer.update({
    where: { id: session.id },
    data: { name: input.name.trim() || null, phone: input.phone.trim() || null }
  });
}

export async function saveAddress(input: AccountAddress & { id?: string }) {
  const session = await requireSession();
  const data = {
    name: input.name.trim(),
    line1: input.line1.trim(),
    line2: input.line2.trim() || null,
    city: input.city.trim(),
    region: input.region.trim() || null,
    postalCode: input.postalCode.trim() || null,
    country: input.country.trim(),
    countryCode: input.countryCode.trim().toUpperCase() || null,
    phone: input.phone.trim() || null,
    isDefault: input.isDefault
  };
  if (!data.name || !data.line1 || !data.city || !data.country) throw new Error("Name, address, city, and country are required.");
  if (data.isDefault) {
    await db.customerAddress.updateMany({ where: { customerId: session.id }, data: { isDefault: false } });
  }
  if (input.id) {
    const owned = await db.customerAddress.findFirst({ where: { id: input.id, customerId: session.id } });
    if (!owned) throw new Error("Address not found.");
    await db.customerAddress.update({ where: { id: owned.id }, data });
    return;
  }
  const count = await db.customerAddress.count({ where: { customerId: session.id } });
  await db.customerAddress.create({
    data: { ...data, customerId: session.id, isDefault: data.isDefault || count === 0 }
  });
}

export async function deleteAddress(id: string) {
  const session = await requireSession();
  await db.customerAddress.deleteMany({ where: { id, customerId: session.id } });
}

export async function replaceAccountCart(lines: unknown) {
  const session = await readCustomerSession();
  if (!session) return null;
  const next = normalizeCartLines(lines);
  await db.customer.update({ where: { id: session.id }, data: { cartLines: next } });
  return next;
}

export async function readAccountCart() {
  const session = await readCustomerSession();
  if (!session) return null;
  const customer = await db.customer.findUnique({ where: { id: session.id }, select: { cartLines: true } });
  if (!customer) return null;
  return readStoredLines(customer.cartLines);
}

export async function sendAccountMessage(input: { subject: string; message: string }) {
  const session = await requireSession();
  const customer = await db.customer.findUnique({ where: { id: session.id } });
  if (!customer) throw new Error("Account not found.");
  const subject = input.subject.trim();
  const message = input.message.trim();
  if (subject.length < 2 || message.length < 4) throw new Error("Add a subject and a short message.");
  await db.contactMessage.create({
    data: { name: customer.name || customer.email, email: customer.email, subject, message }
  });
  await sendTransactionalEmail({
    subject: `Account message: ${subject}`,
    html: emailLayout(
      "Customer account message",
      paragraph(`<strong>${escapeHtml(customer.name || customer.email)}</strong> wrote from their account.`) +
        paragraph(escapeHtml(message).replaceAll("\n", "<br>"))
    ),
    replyTo: customer.email,
    audience: "admins"
  });
}

export async function attachCheckoutCustomer(input: {
  email: string;
  name: string;
  phone: string;
  countryCode: string;
  shipping: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    region?: string;
    postalCode?: string;
    country: string;
    phone: string;
  };
}) {
  const email = normalizeEmail(input.email);
  const session = await readCustomerSession();
  const existing = await db.customer.findUnique({ where: { email }, include: { addresses: true } });
  let customerId = existing?.id || "";
  let issuedPassword = "";

  if (!existing) {
    issuedPassword = generatePassword();
    const created = await db.customer.create({
      data: {
        email,
        name: input.name,
        phone: input.phone,
        passwordHash: hashPassword(issuedPassword)
      }
    });
    customerId = created.id;
  } else {
    customerId = existing.id;
    if (!existing.passwordHash) {
      issuedPassword = generatePassword();
      await db.customer.update({
        where: { id: existing.id },
        data: {
          passwordHash: hashPassword(issuedPassword),
          name: existing.name || input.name,
          phone: existing.phone || input.phone
        }
      });
    } else if (!existing.name || !existing.phone) {
      await db.customer.update({
        where: { id: existing.id },
        data: { name: existing.name || input.name, phone: existing.phone || input.phone }
      });
    }
  }

  const hasAddress = Boolean(existing?.addresses.length);
  if (!hasAddress) {
    await db.customerAddress.create({
      data: {
        customerId,
        name: input.shipping.name,
        line1: input.shipping.line1,
        line2: input.shipping.line2 || null,
        city: input.shipping.city,
        region: input.shipping.region || null,
        postalCode: input.shipping.postalCode || null,
        country: input.shipping.country,
        countryCode: input.countryCode,
        phone: input.shipping.phone,
        isDefault: true
      }
    });
  }

  if (issuedPassword) {
    try {
      await sendAccountPasswordEmail(email, input.name, issuedPassword);
    } catch (error) {
      console.error("Account password email failed", error);
    }
    if (!session) await setCustomerSession(customerId);
  }

  return { customerId, guestCheckout: session?.id !== customerId };
}

async function sendAccountPasswordEmail(email: string, name: string, password: string) {
  const first = name.trim().split(/\s+/)[0] || "there";
  await sendTransactionalEmail({
    subject: "Your Sicon Art account is ready",
    html: emailLayout(
      `${escapeHtml(first)}, your account is ready`,
      paragraph("We created a Sicon Art account from your checkout so you can see this order, save an address, and track parcels later.") +
        paragraph(`Email: <strong>${escapeHtml(email)}</strong><br>Password: <strong>${escapeHtml(password)}</strong>`) +
        `<p style="margin:0 0 18px;"><a href="${siteOrigin()}/account" style="display:inline-block;padding:14px 26px;background:#A67146;color:#ffffff;text-decoration:none;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">Open your account</a></p>` +
        paragraph("This password is only in this email. You can change it after you log in. If you already know this password, keep using it.")
    ),
    toCustomer: email,
    audience: "customer"
  });
}

async function requireSession() {
  const session = await readCustomerSession();
  if (!session) throw new Error("Please log in again.");
  return session;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readStoredLines(value: unknown) {
  return normalizeCartLines(value);
}

function toAddress(address: {
  id: string;
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postalCode: string | null;
  country: string;
  countryCode: string | null;
  phone: string | null;
  isDefault: boolean;
}): AccountAddress {
  return {
    id: address.id,
    name: address.name,
    line1: address.line1,
    line2: address.line2 || "",
    city: address.city,
    region: address.region || "",
    postalCode: address.postalCode || "",
    country: address.country,
    countryCode: address.countryCode || "",
    phone: address.phone || "",
    isDefault: address.isDefault
  };
}
