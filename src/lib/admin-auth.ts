import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { env } from "@/lib/env";

export const ADMIN_COOKIE = "taania_admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", env.adminSessionSecret)
    .update(payload)
    .digest("hex");
}

export function createAdminSessionToken(): string {
  const issuedAt = Date.now().toString();
  const signature = sign(issuedAt);
  return Buffer.from(`${issuedAt}.${signature}`).toString("base64url");
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [issuedAt, signature] = decoded.split(".");
    if (!issuedAt || !signature) return false;
    if (sign(issuedAt) !== signature) return false;

    const age = Date.now() - Number(issuedAt);
    return age >= 0 && age <= SESSION_TTL_MS;
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  return password === env.adminPassword;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export function isAdminRequest(request: NextRequest): boolean {
  return verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
}
