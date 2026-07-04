import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-session";
import { createSessionToken, adminCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => null);
    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password are required." }, { status: 400 });
    }
    if (newPassword.length < 10) {
      return NextResponse.json(
        { error: "New password must be at least 10 characters long." },
        { status: 400 }
      );
    }
    if (newPassword === currentPassword) {
      return NextResponse.json(
        { error: "New password must be different from the current password." },
        { status: 400 }
      );
    }

    const db = supabaseAdmin();
    const { data: admin } = await db
      .from("admin_users")
      .select("id, email, password_hash")
      .eq("id", session.sub)
      .maybeSingle();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ok = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!ok) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });

    const hash = await bcrypt.hash(newPassword, 12);
    const { error } = await db
      .from("admin_users")
      .update({ password_hash: hash, must_change_password: false })
      .eq("id", admin.id);
    if (error) {
      console.error("password update failed:", error);
      return NextResponse.json({ error: "Could not update password." }, { status: 500 });
    }

    // Re-issue session without the must-change flag.
    const token = await createSessionToken({
      sub: admin.id,
      email: admin.email,
      mustChangePassword: false,
    });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(adminCookie.name, token, adminCookie.options);
    return res;
  } catch (err) {
    console.error("POST /api/admin/change-password failed:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
