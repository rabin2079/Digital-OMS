import { NextResponse } from "next/server";
import { supabaseAdmin, UPLOADS_BUCKET } from "@/lib/supabase";
import { checkUploadFile, safeFileName } from "@/lib/validate";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

// POST — admin uploads the final document file for a request.
export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const db = supabaseAdmin();

    const { data: existing } = await db.from("requests").select("id").eq("id", id).maybeSingle();
    if (!existing) return NextResponse.json({ error: "Request not found." }, { status: 404 });

    const form = await request.formData();
    const file = form.get("document");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    const check = checkUploadFile(file);
    if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });

    const path = `${id}/document-${Date.now()}-${safeFileName(file.name)}`;
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await db.storage
      .from(UPLOADS_BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: false });
    if (uploadError) {
      console.error("document upload failed:", uploadError);
      return NextResponse.json({ error: "File upload failed." }, { status: 500 });
    }

    const { error: updateError } = await db
      .from("requests")
      .update({ document_file_url: path })
      .eq("id", id);
    if (updateError) {
      console.error("document_file_url update failed:", updateError);
      return NextResponse.json({ error: "Could not attach document." }, { status: 500 });
    }

    await db.from("uploaded_files").insert({
      request_id: id,
      file_type: "document",
      file_url: path,
      file_name: safeFileName(file.name),
      file_size: file.size,
      mime_type: file.type,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/admin/requests/[id]/document failed:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
