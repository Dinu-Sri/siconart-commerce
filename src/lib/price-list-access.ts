import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const LIST_ACCESS_COOKIE = "siconart_list_access";
export const LIST_PASSWORD = "tina";
export const LIST_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function listAccessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.ADMIN_COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
    path: "/",
    maxAge: LIST_COOKIE_MAX_AGE,
    priority: "high" as const
  };
}

export async function hasListAccess() {
  const cookieStore = await cookies();
  return cookieStore.get(LIST_ACCESS_COOKIE)?.value === "1";
}

export async function grantListAccess() {
  const cookieStore = await cookies();
  cookieStore.set(LIST_ACCESS_COOKIE, "1", listAccessCookieOptions());
}

export function applyListAccessCookie<T extends NextResponse>(response: T) {
  response.cookies.set(LIST_ACCESS_COOKIE, "1", listAccessCookieOptions());
  return response;
}

export function isListPassword(password: string) {
  return password.trim() === LIST_PASSWORD;
}

export function listUnauthorizedResponse(syncId: string) {
  return NextResponse.json(
    {
      ok: false,
      error: "List login is missing in this browser.",
      code: "NO_LIST_COOKIE",
      hint: "Open /list, enter the password, then tap Retry save.",
      syncId
    },
    { status: 401 }
  );
}
