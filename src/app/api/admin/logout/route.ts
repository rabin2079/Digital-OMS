import { NextResponse } from "next/server";
import { adminCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookie.name, "", { ...adminCookie.options, maxAge: 0 });
  return res;
}
