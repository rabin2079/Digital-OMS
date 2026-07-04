import { NextResponse } from "next/server";
import { supabaseAdmin, UPLOADS_BUCKET } from "@/lib/supabase";
import { validateLead, checkUploadFile, safeFileName } from "@/lib/validate";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

async function uploadToStorage(
  file: File,
  requestUuid: string,
  kind: "license_photo" | "payment_receipt"
): Promise<{ path: string } | { error: string }> {
  const check = checkUploadFile(file);
  if (!check.ok) return { error: `${kind === "license_photo" ? "License photo" : "Payment receipt"}: ${check.error}` };

  const path = `${requestUuid}/${kind}-${Date.now()}-${safeFileName(file.name)}`;
  const bytes = await file.arrayBuffer();
  const { error } = await supabaseAdmin()
    .storage.from(UPLOADS_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) return { error: "File upload failed. Please try again." };
  return { path };
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    if (!rateLimit(`submit:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 }).allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const form = await request.formData();

    // Honeypot: real users never fill this hidden field.
    if (typeof form.get("website") === "string" && (form.get("website") as string).length > 0) {
      return NextResponse.json({ error: "Submission rejected." }, { status: 400 });
    }

    const { data, error } = validateLead(form);
    if (error || !data) {
      return NextResponse.json({ error: error || "Invalid submission." }, { status: 400 });
    }

    const db = supabaseAdmin();

    const { data: requestIdData, error: idError } = await db.rpc("next_request_id");
    if (idError || !requestIdData) {
      console.error("next_request_id failed:", idError);
      return NextResponse.json({ error: "Could not create request. Please try again." }, { status: 500 });
    }
    const requestId = requestIdData as string;

    const alreadyPaid = data.payment_option === "already_paid";
    const { data: inserted, error: insertError } = await db
      .from("requests")
      .insert({
        request_id: requestId,
        full_name: data.full_name,
        email: data.email,
        whatsapp_number: data.whatsapp_number,
        destination_country: data.destination_country,
        has_valid_license: data.has_valid_license,
        license_issue_country: data.license_issue_country || null,
        preferred_idp_type: data.preferred_idp_type,
        validity_preference: data.validity_preference,
        delivery_preference: data.delivery_preference,
        message: data.message || null,
        consent_accepted: true,
        status: "New Request",
        payment_status: alreadyPaid ? "Receipt Uploaded" : "Not Required Yet",
        payment_method: alreadyPaid ? data.payment_method : null,
        transaction_id: alreadyPaid ? data.transaction_id || null : null,
      })
      .select("id, request_id, full_name, whatsapp_number, destination_country, preferred_idp_type, status")
      .single();

    if (insertError || !inserted) {
      console.error("insert request failed:", insertError);
      return NextResponse.json({ error: "Could not save request. Please try again." }, { status: 500 });
    }

    // Uploads (best-effort: request stays valid even if a file fails validation server-side,
    // but we report validation errors to the user before insert side-effects matter).
    const fileRows: {
      request_id: string;
      file_type: string;
      file_url: string;
      file_name: string;
      file_size: number;
      mime_type: string;
    }[] = [];

    const licenseFile = form.get("license_photo");
    if (licenseFile instanceof File && licenseFile.size > 0) {
      const uploaded = await uploadToStorage(licenseFile, inserted.id, "license_photo");
      if ("error" in uploaded) {
        return NextResponse.json({ error: uploaded.error }, { status: 400 });
      }
      fileRows.push({
        request_id: inserted.id,
        file_type: "license_photo",
        file_url: uploaded.path,
        file_name: safeFileName(licenseFile.name),
        file_size: licenseFile.size,
        mime_type: licenseFile.type,
      });
    }

    const receiptFile = form.get("payment_receipt");
    if (alreadyPaid && receiptFile instanceof File && receiptFile.size > 0) {
      const uploaded = await uploadToStorage(receiptFile, inserted.id, "payment_receipt");
      if ("error" in uploaded) {
        return NextResponse.json({ error: uploaded.error }, { status: 400 });
      }
      fileRows.push({
        request_id: inserted.id,
        file_type: "payment_receipt",
        file_url: uploaded.path,
        file_name: safeFileName(receiptFile.name),
        file_size: receiptFile.size,
        mime_type: receiptFile.type,
      });
    }

    if (fileRows.length > 0) {
      const { error: filesError } = await db.from("uploaded_files").insert(fileRows);
      if (filesError) console.error("uploaded_files insert failed:", filesError);
    }

    await db.from("status_history").insert({
      request_id: inserted.id,
      old_status: null,
      new_status: "New Request",
      changed_by: "system",
      note: "Request submitted through website form.",
    });

    return NextResponse.json({ request: inserted }, { status: 201 });
  } catch (err) {
    console.error("POST /api/requests failed:", err);
    return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
  }
}
