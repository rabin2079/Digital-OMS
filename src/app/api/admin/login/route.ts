import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { createSessionToken, adminCookie } from "@/lib/auth";
import { sanitizeText, isValidEmail } from "@/lib/validate";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    if (!rateLimit(`login:${ip}`, { limit: 10, windowMs: 15 * 60 * 1000 }).allowed) {
      return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const email = sanitizeText(body?.email, 254).toLowerCase();
    const password = typeof body?.password === "string" ? body.password : "";

    if (!isValidEmail(email) || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const { data: admin } = await supabaseAdmin()
      .from("admin_users")
      .select("id, email, password_hash, must_change_password")
      .eq("email", email)
      .maybeSingle();

    const invalid = NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    if (!admin) {
      // Constant-ish time: still run a bcrypt compare against a dummy hash.
      await bcrypt.compare(password, "$2a$12$C6UzMDM.H6dfI/f/IKcEeO7ZBpDLhIuYWLmVdV0bScAyC0rrCz1lS");
      return invalid;
    }

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return invalid;

    await supabaseAdmin()
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", admin.id);

    const token = await createSessionToken({
      sub: admin.id,
      email: admin.email,
      mustChangePassword: admin.must_change_password,
    });

    const res = NextResponse.json({
      ok: true,
      mustChangePassword: admin.must_change_password,
    });
    res.cookies.set(adminCookie.name, token, adminCookie.options);
    return res;
  } catch (err) {
    console.error("POST /api/admin/login failed:", err);
    return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
  }
}
