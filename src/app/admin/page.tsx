"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { REQUEST_STATUSES, IDP_TYPE_OPTIONS, DELIVERY_OPTIONS } from "@/lib/constants";

interface RequestRow {
  id: string;
  request_id: string;
  full_name: string;
  whatsapp_number: string;
  email: string;
  destination_country: string;
  has_valid_license: string;
  preferred_idp_type: string;
  validity_preference: string;
  delivery_preference: string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Stats {
  total: number;
  byStatus: Record<string, number>;
}

const dashboardCards: { label: string; statusKey: string | null }[] = [
  { label: "Total Requests", statusKey: null },
  { label: "New Requests", statusKey: "New Request" },
  { label: "Contacted", statusKey: "Contacted" },
  { label: "Document Pending", statusKey: "Document Pending" },
  { label: "Payment Pending", statusKey: "Payment Pending" },
  { label: "In Process", statusKey: "In Process" },
  { label: "Download Ready", statusKey: "Download Ready" },
  { label: "Completed", statusKey: "Completed" },
  { label: "Cancelled", statusKey: "Cancelled" },
];

export default function AdminDashboardPage() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [idpType, setIdpType] = useState("");
  const [delivery, setDelivery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const load = useCallback(
    async (pageArg = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (country) params.set("country", country);
        if (idpType) params.set("idp_type", idpType);
        if (delivery) params.set("delivery", delivery);
        if (dateFrom) params.set("date_from", dateFrom);
        if (dateTo) params.set("date_to", dateTo);
        params.set("page", String(pageArg));
        const res = await fetch(`/api/admin/requests?${params.toString()}`);
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || "Could not load requests.");
          return;
        }
        setRows(json.requests);
        setStats(json.stats);
        setTotal(json.total);
        setPage(json.page);
        setPageSize(json.pageSize);
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    },
    [search, status, country, idpType, delivery, dateFrom, dateTo]
  );

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell title="Requests">
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
        {dashboardCards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
            <p className="text-xl font-bold text-brand-700">
              {stats ? (c.statusKey ? stats.byStatus[c.statusKey] || 0 : stats.total) : "–"}
            </p>
            <p className="mt-1 text-xs text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <form
        className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          load(1);
        }}
      >
        <input
          type="text"
          className="form-input !py-2 text-sm"
          placeholder="Search ID, name, WhatsApp, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input !py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {REQUEST_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="text"
          className="form-input !py-2 text-sm"
          placeholder="Destination country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <select className="form-input !py-2 text-sm" value={idpType} onChange={(e) => setIdpType(e.target.value)}>
          <option value="">All IDP types</option>
          {IDP_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select className="form-input !py-2 text-sm" value={delivery} onChange={(e) => setDelivery(e.target.value)}>
          <option value="">All delivery options</option>
          {DELIVERY_OPTIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <input type="date" className="form-input !py-2 text-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <input type="date" className="form-input !py-2 text-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1 !py-2 text-sm">Apply</button>
          <button
            type="button"
            className="btn-secondary !py-2 text-sm"
            onClick={() => {
              setSearch(""); setStatus(""); setCountry(""); setIdpType("");
              setDelivery(""); setDateFrom(""); setDateTo("");
              setTimeout(() => load(1), 0);
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {["Request ID", "Full Name", "WhatsApp", "Email", "Destination", "License", "IDP Type", "Validity", "Delivery", "Status", "Payment", "Created", "Action"].map((h) => (
                <th key={h} className="px-3 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={13} className="px-3 py-8 text-center text-slate-500">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={13} className="px-3 py-8 text-center text-slate-500">No requests found.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-3 py-3 font-semibold text-brand-700">{r.request_id}</td>
                  <td className="px-3 py-3">{r.full_name}</td>
                  <td className="px-3 py-3">{r.whatsapp_number}</td>
                  <td className="px-3 py-3">{r.email}</td>
                  <td className="px-3 py-3">{r.destination_country}</td>
                  <td className="px-3 py-3">{r.has_valid_license}</td>
                  <td className="px-3 py-3">{r.preferred_idp_type}</td>
                  <td className="px-3 py-3">{r.validity_preference}</td>
                  <td className="px-3 py-3">{r.delivery_preference}</td>
                  <td className="px-3 py-3">
                    <span className="whitespace-nowrap rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {r.payment_status}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/requests/${r.id}`}
                      className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Page {page} of {totalPages} ({total} requests)</span>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary !px-4 !py-2 text-sm" disabled={page <= 1} onClick={() => load(page - 1)}>
              Previous
            </button>
            <button type="button" className="btn-secondary !px-4 !py-2 text-sm" disabled={page >= totalPages} onClick={() => load(page + 1)}>
              Next
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
