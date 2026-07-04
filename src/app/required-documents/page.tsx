import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import TrustNotice from "@/components/TrustNotice";

export const metadata: Metadata = {
  title: "Required Documents for IDP Assistance",
  description:
    "See which documents are needed for the first IDP assistance inquiry: only your driving license photo and basic details. More documents are requested later through WhatsApp or email only if needed.",
};

export default function RequiredDocumentsPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Required Documents</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          पहिलो inquiry को लागि धेरै document चाहिँदैन। सुरुमा तलका details मात्र पुग्छ।
        </p>

        <div className="mt-8 card">
          <h2 className="text-lg font-semibold text-slate-900">
            Step 1 — First inquiry (अहिले चाहिने)
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {[
              "Full Name",
              "Email Address",
              "WhatsApp Number",
              "Destination Country (जाने देश)",
              "License status — छ / छैन / थाहा छैन",
              "Driving License front photo (JPG, PNG वा PDF, max 10MB)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <p className="form-help mt-4">
            अहिले license photo मात्र upload गर्नुहोस्। अरू document चाहियो भने हाम्रो team ले
            पछि WhatsApp/email बाट request गर्छ।
          </p>
        </div>

        <div className="mt-6 card">
          <h2 className="text-lg font-semibold text-slate-900">
            Step 2 — Later, only if needed (पछि चाहिन सक्ने)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Processing option र destination अनुसार पछि passport-size photo, passport copy,
            वा अन्य supporting document चाहिन सक्छ। चाहिएमा हाम्रो team ले WhatsApp वा
            email बाट clearly बताउँछ — website मा अहिले नै सबै upload गर्नु पर्दैन।
          </p>
        </div>

        <div className="mt-8">
          <TrustNotice text="Document requirements may vary by processing option, issuing/processing body and destination-country rules. Our team will confirm the exact list for your case before any payment." />
        </div>

        <div className="mt-8">
          <Link href="/apply" className="btn-primary">
            Submit Assistance Request
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
