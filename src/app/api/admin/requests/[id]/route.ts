import { NextResponse } from "next/server";
import { supabaseAdmin, signedFileUrl, UPLOADS_BUCKET } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-session";
import { sanitizeText } from "@/lib/validate";
import { REQUEST_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

// GET — full detail incl. signed file URLs and status history.
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const db = supabaseAdmin();

    const { data: row, error } = await db.from("requests").select("*").eq("id", id).maybeSingle();
    if (error || !row) return NextResponse.json({ error: "Request not found." }, { status: 404 });

    const { data: files } = await db
      .from("uploaded_files")
      .select("id, file_type, file_url, file_name, file_size, mime_type, uploaded_at")
      .eq("request_id", id)
      .order("uploaded_at", { ascending: false });

    const filesWithUrls = await Promise.all(
      (files || []).map(async (f) => ({
        ...f,
        signed_url: await signedFileUrl(f.file_url, 60 * 15),
      }))
    );

    const { data: history } = await db
      .from("status_history")
      .select("id, old_status, new_status, changed_by, note, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: false });

    let documentSignedUrl: string | null = null;
    if (row.document_file_url) {
      documentSignedUrl = await signedFileUrl(row.document_file_url, 60 * 15);
    }

    return NextResponse.json({
      request: row,
      files: filesWithUrls,
      history: history || [],
      document_signed_url: documentSignedUrl,
    });
  } catch (err) {
    console.error("GET /api/admin/requests/[id] failed:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

// PATCH — update status, payment status, notes, message, download link/availability.
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getAdminSession();
    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

    const db = supabaseAdmin();
    const { data: existing } = await db
      .from("requests")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();
    if (!existing) return NextResponse.json({ error: "Request not found." }, { status: 404 });

    const updates: Record<string, unknown> = {};

    if (typeof body.status === "string") {
      if (!(REQUEST_STATUSES as readonly string[]).includes(body.status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      updates.status = body.status;
    }
    if (typeof body.payment_status === "string") {
      if (!(PAYMENT_STATUSES as readonly string[]).includes(body.payment_status)) {
        return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
      }
      updates.payment_status = body.payment_status;
    }
    if (typeof body.admin_note === "string") updates.admin_note = sanitizeText(body.admin_note, 5000) || null;
    if (typeof body.user_visible_message === "string")
      updates.user_visible_message = sanitizeText(body.user_visible_message, 2000) || null;
    if (typeof body.document_download_url === "string") {
      const link = sanitizeText(body.document_download_url, 500);
      if (link && !/^https?:\/\//i.test(link)) {
        return NextResponse.json({ error: "Download link must start with http(s)://" }, { status: 400 });
      }
      updates.document_download_url = link || null;
    }
    if (typeof body.is_download_available === "boolean")
      updates.is_download_available = body.is_download_available;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const { error: updateError } = await db.from("requests").update(updates).eq("id", id);
    if (updateError) {
      console.error("request update failed:", updateError);
      return NextResponse.json({ error: "Could not update request." }, { status: 500 });
    }

    if (updates.status && updates.status !== existing.status) {
      await db.from("status_history").insert({
        request_id: id,
        old_status: existing.status,
        new_status: updates.status as string,
        changed_by: session?.email || "admin",
        note: typeof body.status_note === "string" ? sanitizeText(body.status_note, 1000) || null : null,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/admin/requests/[id] failed:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

// DELETE — remove request, its history/files rows and storage objects.
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const db = supabaseAdmin();

    const { data: files } = await db.from("uploaded_files").select("file_url").eq("request_id", id);
    const { data: row } = await db
      .from("requests")
      .select("document_file_url")
      .eq("id", id)
      .maybeSingle();
    if (!row) return NextResponse.json({ error: "Request not found." }, { status: 404 });

    const paths = (files || []).map((f) => f.file_url);
    if (row.document_file_url) paths.push(row.document_file_url);
    if (paths.length > 0) {
      await db.storage.from(UPLOADS_BUCKET).remove(paths);
    }

    const { error } = await db.from("requests").delete().eq("id", id);
    if (error) {
      console.error("request delete failed:", error);
      return NextResponse.json({ error: "Could not delete request." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/requests/[id] failed:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
