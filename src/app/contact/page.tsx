import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact — Digital Solution IDP Assistance Support",
  description:
    "Contact Digital Solution for IDP assistance: WhatsApp support, email support and inquiry form. Nepali-English support for International Driving Permit questions.",
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Contact Us</h1>
        <p className="mt-3 text-base text-slate-600">
          IDP assistance बारे कुनै प्रश्न छ? हामीलाई WhatsApp वा email बाट सम्पर्क गर्नुहोस्।
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900">WhatsApp Support</h2>
            <p className="mt-1 text-sm text-slate-600">
              {SITE.whatsappNumber
                ? `+${SITE.whatsappNumber}`
                : "Add Digital Solution WhatsApp number here"}
            </p>
            <div className="mt-4">
              <WhatsAppButton message="Hello Digital Solution, I have a question about IDP assistance." />
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900">Email Support</h2>
            <p className="mt-1 text-sm text-slate-600">{SITE.email}</p>
            <div className="mt-4">
              <a href={`mailto:${SITE.email}`} className="btn-secondary">
                Send Email
              </a>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900">Office / Contact</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Digital Solution
              <br />
              Website:{" "}
              <a
                href={`https://${SITE.mainSite}`}
                className="text-brand-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE.mainSite}
              </a>
            </p>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900">Quick Inquiry</h2>
            <p className="mt-1 text-sm text-slate-600">
              सबैभन्दा छिटो तरिका — simple inquiry form भरेर पठाउनुहोस्।
            </p>
            <div className="mt-4">
              <Link href="/apply" className="btn-primary">
                Open Inquiry Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
