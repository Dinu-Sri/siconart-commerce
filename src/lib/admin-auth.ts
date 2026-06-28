import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";

const COOKIE_NAME = "siconart_admin";

export async function requireAdmin(locale: string) {
  if (!(await isAdminSession())) redirect(localeHref(locale as Locale, "/admin/login"));
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
    secure: process.env.ADMIN_COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function isValidAdminLogin(email: string, password: string) {
  return email.trim().toLowerCase() === adminEmail() && password.trim() === adminPassword();
}

function createToken() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() || adminPassword() || "siconart-dev-admin";
  return crypto.createHmac("sha256", secret).update("siconart-admin-v1").digest("hex");
}

function adminEmail() {
  return (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
}

function adminPassword() {
  return (process.env.ADMIN_PASSWORD || "").trim();
}
