"use client";

import { useState } from "react";
import Link from "next/link";
import TrustNotice from "@/components/TrustNotice";
import WhatsAppButton from "@/components/WhatsAppButton";
import { requestWhatsappMessage } from "@/lib/whatsapp";
import {
  LICENSE_OPTIONS,
  IDP_TYPE_OPTIONS,
  VALIDITY_OPTIONS,
  DELIVERY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "@/lib/constants";

interface SubmittedRequest {
  request_id: string;
  full_name: string;
  whatsapp_number: string;
  destination_country: string;
  preferred_idp_type: string;
  status: string;
}

function Select({
  name,
  label,
  options,
  help,
  required = true,
}: {
  name: string;
  label: string;
  options: readonly string[];
  help?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select id={name} name={name} className="form-input" required={required} defaultValue="">
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {help && <p className="form-help">{help}</p>}
    </div>
  );
}

export default function ApplyForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentOption, setPaymentOption] = useState<"whatsapp_first" | "already_paid">(
    "whatsapp_first"
  );
  const [done, setDone] = useState<SubmittedRequest | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const form = new FormData(e.currentTarget);
      form.set("payment_option", paymentOption);
      const res = await fetch("/api/requests", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(json.request);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div>
        <div className="card border-emerald-200 bg-emerald-50 text-center">
          <svg className="mx-auto h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Thank you. Your IDP assistance request has been received.
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            तपाईंको request दर्ता भयो। हाम्रो team ले छिट्टै contact गर्नेछ।
          </p>
        </div>

        <div className="card mt-6">
          <dl className="divide-y divide-slate-100">
            {[
              ["Request ID", done.request_id],
              ["Name", done.full_name],
              ["WhatsApp Number", done.whatsapp_number],
              ["Destination Country", done.destination_country],
              ["Package Preference", done.preferred_idp_type],
              ["Current Status", done.status],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-3">
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="text-sm font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="form-help mt-2">
            आफ्नो Request ID save गरेर राख्नुहोस् — tracking को लागि चाहिन्छ।
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton
            message={requestWhatsappMessage(done)}
            label="Continue on WhatsApp"
            className="btn-whatsapp flex-1"
          />
          <Link href={`/track?request_id=${encodeURIComponent(done.request_id)}`} className="btn-secondary flex-1">
            Track Request
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">IDP Assistance Request Form</h1>
      <p className="mt-2 text-sm text-slate-600">
        Simple form भर्नुहोस् — २ मिनेट मात्र लाग्छ। बाँकी process WhatsApp/email बाट हुन्छ।
      </p>

      <div className="mt-6">
        <TrustNotice />
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {/* Honeypot field for spam bots — hidden from real users */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label htmlFor="full_name" className="form-label">Full Name *</label>
          <input id="full_name" name="full_name" type="text" className="form-input" required maxLength={120} placeholder="Your full name" />
        </div>

        <div>
          <label htmlFor="email" className="form-label">Email Address *</label>
          <input id="email" name="email" type="email" className="form-input" required placeholder="you@example.com" />
        </div>

        <div>
          <label htmlFor="whatsapp_number" className="form-label">WhatsApp Number *</label>
          <input id="whatsapp_number" name="whatsapp_number" type="tel" className="form-input" required placeholder="+977 98XXXXXXXX" />
        </div>

        <div>
          <label htmlFor="destination_country" className="form-label">
            Destination Country / तपाईं कुन देश जानु हुँदैछ? *
          </label>
          <input id="destination_country" name="destination_country" type="text" className="form-input" required maxLength={80} placeholder="e.g. Australia, UAE, Japan" />
        </div>

        <Select name="has_valid_license" label="Do you have a valid driving license? *" options={LICENSE_OPTIONS} />

        <div>
          <label htmlFor="license_issue_country" className="form-label">License Issue Country</label>
          <input id="license_issue_country" name="license_issue_country" type="text" className="form-input" maxLength={80} placeholder="Nepal, India, UAE, Qatar, etc." />
        </div>

        <Select name="preferred_idp_type" label="Preferred IDP Type *" options={IDP_TYPE_OPTIONS} />
        <Select name="validity_preference" label="Validity Preference *" options={VALIDITY_OPTIONS} />
        <Select name="delivery_preference" label="Delivery Preference *" options={DELIVERY_OPTIONS} />

        <div>
          <label htmlFor="license_photo" className="form-label">Upload Driving License Photo</label>
          <input
            id="license_photo"
            name="license_photo"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
            className="form-input !py-2"
          />
          <p className="form-help">
            JPG, PNG वा PDF (max 10MB) — front photo मात्र भए पुग्छ। अहिले license photo
            मात्र upload गर्नुहोस्। अरू document चाहियो भने हाम्रो team ले पछि
            WhatsApp/email बाट request गर्छ।
          </p>
        </div>

        <div>
          <label htmlFor="message" className="form-label">Message / Question</label>
          <textarea id="message" name="message" rows={4} className="form-input" maxLength={2000} placeholder="Optional — केही सोध्नु छ भने यहाँ लेख्नुहोस्" />
        </div>

        {/* Payment / support option */}
        <fieldset className="rounded-xl border border-slate-200 p-5">
          <legend className="px-2 text-sm font-semibold text-slate-800">
            Payment / Support Option
          </legend>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="payment_option_radio"
                className="mt-1"
                checked={paymentOption === "whatsapp_first"}
                onChange={() => setPaymentOption("whatsapp_first")}
              />
              <span className="text-sm text-slate-700">
                I want to talk on WhatsApp first
                <span className="block text-xs text-slate-500">
                  Payment अहिले चाहिँदैन — पहिला WhatsApp मा कुरा गरौँ।
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="payment_option_radio"
                className="mt-1"
                checked={paymentOption === "already_paid"}
                onChange={() => setPaymentOption("already_paid")}
              />
              <span className="text-sm text-slate-700">
                I have already paid and want to upload receipt
              </span>
            </label>
          </div>

          {paymentOption === "already_paid" && (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
              <Select name="payment_method" label="Payment Method *" options={PAYMENT_METHOD_OPTIONS} />
              <div>
                <label htmlFor="transaction_id" className="form-label">
                  Transaction ID / Reference Number
                </label>
                <input id="transaction_id" name="transaction_id" type="text" className="form-input" maxLength={100} />
              </div>
              <div>
                <label htmlFor="payment_receipt" className="form-label">Payment Receipt Upload</label>
                <input
                  id="payment_receipt"
                  name="payment_receipt"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  className="form-input !py-2"
                />
                <p className="form-help">JPG, PNG वा PDF (max 10MB)</p>
              </div>
            </div>
          )}
        </fieldset>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
          <input type="checkbox" name="consent_accepted" required className="mt-1" />
          <span className="text-sm text-slate-700">
            I understand that Digital Solution provides guidance and assistance only and does
            not directly issue official IDP documents.
          </span>
        </label>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Assistance Request"}
        </button>
      </form>
    </div>
  );
}
