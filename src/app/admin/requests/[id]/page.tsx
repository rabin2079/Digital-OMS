"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { REQUEST_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

interface FileRow {
  id: string;
  file_type: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  signed_url: string | null;
}

interface HistoryRow {
  id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string;
  note: string | null;
  created_at: string;
}

interface RequestDetail {
  id: string;
  request_id: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  destination_country: string;
  has_valid_license: string;
  license_issue_country: string | null;
  preferred_idp_type: string;
  validity_preference: string;
  delivery_preference: string;
  message: string | null;
  status: string;
  payment_status: string;
  payment_method: string | null;
  transaction_id: string | null;
  admin_note: string | null;
  user_visible_message: string | null;
  document_download_url: string | null;
  document_file_url: string | null;
  is_download_available: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<RequestDetail | null>(null);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [downloadAvailable, setDownloadAvailable] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/requests/${id}`);
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not load request.");
        return;
      }
      const r: RequestDetail = json.request;
      setData(r);
      setFiles(json.files);
      setHistory(json.history);
      setDocumentUrl(json.document_signed_url);
      setStatus(r.status);
      setPaymentStatus(r.payment_status);
      setAdminNote(r.admin_note || "");
      setUserMessage(r.user_visible_message || "");
      setDownloadLink(r.document_download_url || "");
      setDownloadAvailable(r.is_download_available);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!data) return;
    setSaving(true);
    setNotice(null);
    setError(null);
    try {
      if (documentFile) {
        const form = new FormData();
        form.set("document", documentFile);
        const upRes = await fetch(`/api/admin/requests/${id}/document`, {
          method: "POST",
          body: form,
        });
        const upJson = await upRes.json();
        if (!upRes.ok) {
          setError(upJson.error || "Document upload failed.");
          return;
        }
        setDocumentFile(null);
      }
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          payment_status: paymentStatus,
          admin_note: adminNote,
          user_visible_message: userMessage,
          document_download_url: downloadLink,
          is_download_available: downloadAvailable,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not save changes.");
        return;
      }
      setNotice("Changes saved.");
      await load();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!data) return;
    if (!window.confirm(`Delete request ${data.request_id}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin");
    } else {
      const json = await res.json();
      setError(json.error || "Could not delete request.");
    }
  }

  const whatsappHref = data
    ? `https://wa.me/${data.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hello ${data.full_name}, this is Digital Solution regarding your IDP assistance request ${data.request_id}.`
      )}`
    : "#";
  const mailHref = data
    ? `mailto:${data.email}?subject=${encodeURIComponent(
        `Your IDP Assistance Request ${data.request_id}`
      )}&body=${encodeURIComponent(
        `Hello ${data.full_name},\n\nThis is Digital Solution regarding your IDP assistance request ${data.request_id}.\n\n`
      )}`
    : "#";

  if (loading) {
    return (
      <AdminShell title="Request Detail">
        <p className="text-slate-500">Loading…</p>
      </AdminShell>
    );
  }

  if (!data) {
    return (
      <AdminShell title="Request Detail">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Request not found."}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={`Request ${data.request_id}`}>
      {notice && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: user details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900">Applicant Details</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {[
                ["Full Name", data.full_name],
                ["Email", data.email],
                ["WhatsApp", data.whatsapp_number],
                ["Destination Country", data.destination_country],
                ["License Available", data.has_valid_license],
                ["License Issue Country", data.license_issue_country || "—"],
                ["Preferred IDP Type", data.preferred_idp_type],
                ["Validity Preference", data.validity_preference],
                ["Delivery Preference", data.delivery_preference],
                ["Payment Method", data.payment_method || "—"],
                ["Transaction ID", data.transaction_id || "—"],
                ["Created", new Date(data.created_at).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
            {data.message && (
              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Message / Question</p>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{data.message}</p>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-whatsapp !px-4 !py-2 text-sm">
                Contact on WhatsApp
              </a>
              <a href={mailHref} className="btn-secondary !px-4 !py-2 text-sm">
                Send Email
              </a>
            </div>
          </div>

          {/* Uploaded files */}
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900">Uploaded Files</h2>
            {files.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No files uploaded.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {f.file_type === "license_photo"
                          ? "License Photo"
                          : f.file_type === "payment_receipt"
                            ? "Payment Receipt"
                            : "Document"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {f.file_name} · {(f.file_size / 1024).toFixed(0)} KB ·{" "}
                        {new Date(f.uploaded_at).toLocaleString()}
                      </p>
                    </div>
                    {f.signed_url ? (
                      <a
                        href={f.signed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary !px-4 !py-1.5 text-sm"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">Unavailable</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Status history */}
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900">Status History</h2>
            {history.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No history yet.</p>
            ) : (
              <ol className="mt-3 space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                    <p className="font-medium text-slate-800">
                      {h.old_status ? `${h.old_status} → ` : ""}{h.new_status}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {h.changed_by} · {new Date(h.created_at).toLocaleString()}
                      {h.note ? ` · ${h.note}` : ""}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Right: admin actions */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900">Update Request</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="form-label" htmlFor="status">Status</label>
                <select id="status" className="form-input !py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {REQUEST_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="payment_status">Payment Status</label>
                <select id="payment_status" className="form-input !py-2 text-sm" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="admin_note">Internal Note (admin only)</label>
                <textarea id="admin_note" rows={3} className="form-input text-sm" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} />
              </div>
              <div>
                <label className="form-label" htmlFor="user_message">User-Visible Message</label>
                <textarea id="user_message" rows={3} className="form-input text-sm" value={userMessage} onChange={(e) => setUserMessage(e.target.value)} />
                <p className="form-help">Shown on the user&apos;s tracking page.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900">Document / Download</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="form-label" htmlFor="document_file">Upload Document File</label>
                <input
                  id="document_file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="form-input !py-2 text-sm"
                  onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                />
                {data.document_file_url && documentUrl && (
                  <p className="form-help">
                    Current file:{" "}
                    <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                      view uploaded document
                    </a>
                  </p>
                )}
              </div>
              <div>
                <label className="form-label" htmlFor="download_link">External Download Link</label>
                <input
                  id="download_link"
                  type="url"
                  className="form-input !py-2 text-sm"
                  placeholder="https://…"
                  value={downloadLink}
                  onChange={(e) => setDownloadLink(e.target.value)}
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={downloadAvailable}
                  onChange={(e) => setDownloadAvailable(e.target.checked)}
                />
                <span className="text-sm text-slate-700">
                  Download available to user
                  <span className="block text-xs text-slate-500">
                    User sees the file/link on the tracking page only when checked.
                  </span>
                </span>
              </label>
            </div>
          </div>

          <button type="button" className="btn-primary w-full" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>

          <button
            type="button"
            className="w-full rounded-lg border border-red-200 bg-white px-6 py-3 text-base font-semibold text-red-600 hover:bg-red-50"
            onClick={remove}
          >
            Delete Request
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
