import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";
const SESSION_HOURS = 12;

export interface AdminSession {
  sub: string; // admin user id
  email: string;
  mustChangePassword: boolean;
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is not configured (use a long random string).");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: AdminSession): Promise<string> {
  return new SignJWT({ email: session.email, mcp: session.mustChangePassword })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      mustChangePassword: payload.mcp === true,
    };
  } catch {
    return null;
  }
}

export const adminCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  },
};
