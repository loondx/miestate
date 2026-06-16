import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Minimal admin auth: a single shared password (env) exchanged for a signed,
 * httpOnly session cookie. Edge-compatible (jose) so middleware can verify it.
 * Phase 2 swaps this for Supabase Auth.
 */

export const ADMIN_COOKIE = "mie_admin";
const SESSION_TTL = "7d";

function secretKey(): Uint8Array {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    "dev-only-insecure-secret-change-me-please-32";
  return new TextEncoder().encode(secret);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export async function createSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(secretKey());
}

export async function verifySession(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** For route handlers: verifies the admin cookie on the incoming request. */
export async function isAdminRequest(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return verifySession(token);
}
