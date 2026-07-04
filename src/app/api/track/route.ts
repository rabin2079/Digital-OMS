import { NextResponse } from "next/server";
import { supabaseAdmin, signedFileUrl } from "@/lib/supabase";
import { sanitizeText } from "@/lib/validate";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    if (!rateLimit(`track:${ip}`, { limit: 20, windowMs: 10 * 60 * 1000 }).allowed) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const requestId = sanitizeText(body?.request_id, 30).toUpperCase();
    const contact = sanitizeText(body?.contact, 254);

    if (!requestId || !contact) {
      return NextResponse.json(
        { error: "Request ID and WhatsApp number or email are required." },
        { status: 400 }
      );
    }

    const { data: row, error } = await supabaseAdmin()
      .from("requests")
      .select(
        "request_id, full_name, email, whatsapp_number, destination_country, preferred_idp_type, validity_preference, delivery_preference, status, payment_status, user_visible_message, is_download_available, document_download_url, document_file_url, updated_at"
      )
      .eq("request_id", requestId)
      .maybeSingle();

    const notFound = NextResponse.json(
      { error: "Request not found. Please check your Request ID and contact details." },
      { status: 404 }
    );
    if (error || !row) return notFound;

    // Contact must match the email OR the WhatsApp number used on the form.
    const normalizedContact = contact.toLowerCase().replace(/[\s\-()]/g, "");
    const emailMatch = row.email.toLowerCase() === contact.toLowerCase();
    const phoneMatch =
      row.whatsapp_number.replace(/[\s\-()]/g, "").replace(/^\+/, "").endsWith(
        normalizedContact.replace(/^\+/, "")
      ) && normalizedContact.replace(/^\+/, "").length >= 7;
    if (!emailMatch && !phoneMatch) return notFound;

    let downloadUrl: string | null = null;
    if (row.is_download_available) {
      if (row.document_file_url) {
        downloadUrl = await signedFileUrl(row.document_file_url, 60 * 30);
      } else if (row.document_download_url) {
        downloadUrl = row.document_download_url;
      }
    }

    return NextResponse.json({
      request: {
        request_id: row.request_id,
        full_name: row.full_name,
        destination_country: row.destination_country,
        preferred_idp_type: row.preferred_idp_type,
        validity_preference: row.validity_preference,
        delivery_preference: row.delivery_preference,
        status: row.status,
        payment_status: row.payment_status,
        user_visible_message: row.user_visible_message,
        is_download_available: row.is_download_available && !!downloadUrl,
        download_url: downloadUrl,
        updated_at: row.updated_at,
      },
    });
  } catch (err) {
    console.error("POST /api/track failed:", err);
    return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
  }
}
