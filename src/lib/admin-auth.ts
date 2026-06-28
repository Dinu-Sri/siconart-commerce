import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "siconart_admin";

export async function requireAdmin(locale: string) {
  if (!(await isAdminSession())) redirect(`/${locale}/admin/login`);
}

export async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === createToken();
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function isValidAdminLogin(email: string, password: string) {
  return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
}

function createToken() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "siconart-dev-admin";
  return crypto.createHmac("sha256", secret).update("siconart-admin-v1").digest("hex");
}
