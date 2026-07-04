import { cookies } from "next/headers";
import { adminCookie, verifySessionToken, AdminSession } from "./auth";

/** Read + verify the admin session inside API route handlers. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(adminCookie.name)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
