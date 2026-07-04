import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sanitizeText } from "@/lib/validate";
import { REQUEST_STATUSES, IDP_TYPE_OPTIONS, DELIVERY_OPTIONS } from "@/lib/constants";

export const runtime = "nodejs";

// GET /api/admin/requests — list with search, filters, stats and pagination.
// Auth is enforced by middleware.
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = sanitizeText(url.searchParams.get("search"), 120);
    const status = sanitizeText(url.searchParams.get("status"), 60);
    const country = sanitizeText(url.searchParams.get("country"), 80);
    const idpType = sanitizeText(url.searchParams.get("idp_type"), 60);
    const delivery = sanitizeText(url.searchParams.get("delivery"), 60);
    const dateFrom = sanitizeText(url.searchParams.get("date_from"), 20);
    const dateTo = sanitizeText(url.searchParams.get("date_to"), 20);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
    const pageSize = 25;

    const db = supabaseAdmin();
    let query = db
      .from("requests")
      .select(
        "id, request_id, full_name, whatsapp_number, email, destination_country, has_valid_license, preferred_idp_type, validity_preference, delivery_preference, status, payment_status, created_at",
        { count: "exact" }
      );

    if (search) {
      const term = search.replace(/[%_,]/g, "");
      query = query.or(
        `request_id.ilike.%${term}%,full_name.ilike.%${term}%,whatsapp_number.ilike.%${term}%,email.ilike.%${term}%`
      );
    }
    if (status && (REQUEST_STATUSES as readonly string[]).includes(status)) {
      query = query.eq("status", status);
    }
    if (country) query = query.ilike("destination_country", `%${country.replace(/[%_]/g, "")}%`);
    if (idpType && (IDP_TYPE_OPTIONS as readonly string[]).includes(idpType)) {
      query = query.eq("preferred_idp_type", idpType);
    }
    if (delivery && (DELIVERY_OPTIONS as readonly string[]).includes(delivery)) {
      query = query.eq("delivery_preference", delivery);
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateFrom)) query = query.gte("created_at", `${dateFrom}T00:00:00Z`);
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateTo)) query = query.lte("created_at", `${dateTo}T23:59:59Z`);

    const from = (page - 1) * pageSize;
    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("admin list failed:", error);
      return NextResponse.json({ error: "Could not load requests." }, { status: 500 });
    }

    // Stats for dashboard cards
    const { data: statusRows } = await db.from("requests").select("status");
    const counts: Record<string, number> = {};
    for (const row of statusRows || []) {
      counts[row.status] = (counts[row.status] || 0) + 1;
    }

    return NextResponse.json({
      requests: data || [],
      total: count || 0,
      page,
      pageSize,
      stats: {
        total: statusRows?.length || 0,
        byStatus: counts,
      },
    });
  } catch (err) {
    console.error("GET /api/admin/requests failed:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
