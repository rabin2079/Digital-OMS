"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import { requestWhatsappMessage } from "@/lib/whatsapp";

interface TrackResult {
  request_id: string;
  full_name: string;
  destination_country: string;
  preferred_idp_type: string;
  validity_preference: string;
  delivery_preference: string;
  status: string;
  payment_status: string;
  user_visible_message: string | null;
  is_download_available: boolean;
  download_url: string | null;
  updated_at: string;
}

export default function TrackForm() {
  const params = useSearchParams();
  const [requestId, setRequestId] = useState(params.get("request_id") || "");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId.trim(), contact: contact.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Request not found. Please check your details.");
        return;
      }
      setResult(json.request);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="card mt-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="request_id" className="form-label">Request ID *</label>
          <input
            id="request_id"
            type="text"
            className="form-input"
            required
            placeholder="DS-IDP-2026-00001"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="contact" className="form-label">WhatsApp Number or Email *</label>
          <input
            id="contact"
            type="text"
            className="form-input"
            required
            placeholder="Form भर्दा प्रयोग गरेको number वा email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Checking…" : "Track Request"}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900">{result.request_id}</h2>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                {result.status}
              </span>
            </div>
            <dl className="mt-4 divide-y divide-slate-100">
              {[
                ["Applicant Name", result.full_name],
                ["Destination Country", result.destination_country],
                ["Preferred IDP Type", result.preferred_idp_type],
                ["Validity Preference", result.validity_preference],
                ["Delivery Preference", result.delivery_preference],
                ["Payment Status", result.payment_status],
                ["Last Updated", new Date(result.updated_at).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-sm text-slate-500">{label}</dt>
                  <dd className="text-right text-sm font-semibold text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {result.user_visible_message && (
            <div className="rounded-xl border border-accent-100 bg-accent-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Message from our team</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {result.user_visible_message}
              </p>
            </div>
          )}

          <div className="card">
            <h3 className="text-base font-semibold text-slate-900">Your Document / Download Link</h3>
            {result.is_download_available && result.download_url ? (
              <a
                href={result.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4"
              >
                Download Document
              </a>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                Your document/download link is not available yet. Our team will update you
                once processing is complete.
              </p>
            )}
          </div>

          <WhatsAppButton
            message={requestWhatsappMessage(result)}
            label="Continue on WhatsApp"
            className="btn-whatsapp w-full"
          />
        </div>
      )}
    </div>
  );
}
