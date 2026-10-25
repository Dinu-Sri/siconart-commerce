import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "siconart_customer";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type CustomerSession = { id: string };

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = crypto.scryptSync(password, salt, 32);
  const current = Buffer.from(hash, "hex");
  if (current.length !== next.length) return false;
  return crypto.timingSafeEqual(current, next);
}

export function generatePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(12);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function newResetToken() {
  return crypto.randomBytes(24).toString("hex");
}

export async function readCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function setCustomerSession(customerId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, signSession(customerId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.ADMIN_COOKIE_SECURE === "true",
    path: "/",
    maxAge: MAX_AGE_SECONDS
  });
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim() || "siconart-dev-customer";
}

function signSession(customerId: string) {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${customerId}.${exp}`;
  const sig = crypto.createHmac("sha256", sessionSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string | undefined): CustomerSession | null {
  if (!token) return null;
  const [id, exp, sig] = token.split(".");
  if (!id || !exp || !sig) return null;
  const payload = `${id}.${exp}`;
  const expected = crypto.createHmac("sha256", sessionSecret()).update(payload).digest("hex");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return null;
  if (Number(exp) < Date.now()) return null;
  return { id };
}
