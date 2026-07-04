import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  // Prefix cells that could be interpreted as formulas by spreadsheet apps.
  const guarded = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${guarded.replace(/"/g, '""')}"`;
}

// GET /api/admin/export — CSV of all requests (auth enforced by middleware).
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from("requests")
      .select(
        "request_id, full_name, email, whatsapp_number, destination_country, has_valid_license, license_issue_country, preferred_idp_type, validity_preference, delivery_preference, status, payment_status, payment_method, transaction_id, message, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("export failed:", error);
      return NextResponse.json({ error: "Could not export." }, { status: 500 });
    }

    const headers = [
      "Request ID", "Full Name", "Email", "WhatsApp", "Destination Country",
      "License Available", "License Issue Country", "IDP Type", "Validity",
      "Delivery", "Status", "Payment Status", "Payment Method", "Transaction ID",
      "Message", "Created At", "Updated At",
    ];
    const lines = [headers.map(csvCell).join(",")];
    for (const r of data || []) {
      lines.push(
        [
          r.request_id, r.full_name, r.email, r.whatsapp_number, r.destination_country,
          r.has_valid_license, r.license_issue_country, r.preferred_idp_type,
          r.validity_preference, r.delivery_preference, r.status, r.payment_status,
          r.payment_method, r.transaction_id, r.message, r.created_at, r.updated_at,
        ].map(csvCell).join(",")
      );
    }

    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="idp-requests-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("GET /api/admin/export failed:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
