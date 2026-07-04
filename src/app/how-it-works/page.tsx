import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import TrustNotice from "@/components/TrustNotice";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "How It Works — Simple 4-Step IDP Assistance Process",
  description:
    "Understand the simple 4-step process for IDP assistance: fill a simple inquiry form, upload your driving license photo, our team reviews, then continue through WhatsApp or email.",
};

const steps = [
  {
    n: 1,
    title: "Fill simple inquiry form",
    text: "Name, email, WhatsApp number, destination country, license status र package preference मात्र भर्नुहोस्। लामो multi-step application छैन।",
  },
  {
    n: 2,
    title: "Upload driving license photo",
    text: "आफ्नो driving license को front photo upload गर्नुहोस् (JPG, PNG वा PDF, max 10MB)। अहिलेलाई यति नै पुग्छ।",
  },
  {
    n: 3,
    title: "Our team reviews your details",
    text: "हाम्रो team ले तपाईंको details, license status र preference review गरेर suitable option बारे guide गर्छ।",
  },
  {
    n: 4,
    title: "Continue through WhatsApp or email",
    text: "बाँकी document, payment discussion र process update — सबै WhatsApp वा email बाट continue हुन्छ।",
  },
];

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">How It Works</h1>
        <p className="mt-3 text-base text-slate-600">
          IDP assistance को process धेरै सजिलो छ — जम्मा ४ step मा।
        </p>

        <div className="mt-8 space-y-4">
          {steps.map((s) => (
            <div key={s.n} className="card flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-base font-bold text-white">
                {s.n}
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{s.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm leading-relaxed text-slate-600">
            पहिलो चरणमा धेरै details चाहिँदैन। Name, email, WhatsApp, जाने देश, license
            छ/छैन, package preference र license photo भए पुग्छ। बाँकी document चाहियो भने
            team ले WhatsApp वा email मार्फत माग्छ।
          </p>
        </div>

        <div className="mt-8">
          <TrustNotice />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/apply" className="btn-primary">
            Submit Assistance Request
          </Link>
          <WhatsAppButton message="Hello Digital Solution, I want to understand the IDP assistance process." />
        </div>
      </div>
    </PublicLayout>
  );
}
