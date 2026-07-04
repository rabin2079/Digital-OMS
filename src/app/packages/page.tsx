import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Packages — Digital IDP & Printed IDP Assistance Options",
  description:
    "Compare Digital IDP and Printed IDP assistance options with 1, 2 or 3 year validity and fast or normal delivery. Contact Digital Solution for the current service charge range.",
};

const packages = [
  {
    name: "Digital IDP",
    tagline: "Digital document / translation copy",
    features: [
      "Validity options: 1 Year / 2 Years / 3 Years",
      "Delivery: Digital only — courier चाहिँदैन",
      "Faster processing सम्भावना",
      "Acceptance destination अनुसार फरक हुन सक्छ",
    ],
    pricing:
      "Service charge depends on validity and processing option. Contact Digital Solution for latest price range.",
  },
  {
    name: "Printed IDP",
    tagline: "Physical printed document / card / booklet",
    features: [
      "Validity options: 1 Year / 2 Years / 3 Years",
      "Fast Delivery option available (case अनुसार)",
      "Normal Delivery: 40–50 days estimate",
      "Physical document चाहिने situation को लागि",
    ],
    pricing:
      "Printed document and delivery charge depend on destination, processing speed, and delivery method. Contact Digital Solution for current price range.",
  },
];

export default function PackagesPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">Packages</h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-slate-600">
          Website मा fixed price देखाइँदैन — validity, document type, delivery method र
          processing availability अनुसार charge फरक हुन्छ। Latest price range को लागि
          Digital Solution लाई contact गर्नुहोस्।
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {packages.map((pkg) => (
            <div key={pkg.name} className="card flex flex-col">
              <h2 className="text-xl font-bold text-brand-700">{pkg.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{pkg.tagline}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg bg-accent-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">
                  Price Range
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{pkg.pricing}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <WhatsAppButton
            message="Hello Digital Solution, I want to check my eligibility for IDP assistance."
            label="Check Eligibility on WhatsApp"
          />
          <Link href="/apply" className="btn-primary">
            Submit Assistance Request
          </Link>
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Important Package Disclaimer</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Digital and printed document availability, delivery time, and acceptance may
            depend on processing partner, issuing body, courier service, and
            destination-country requirements. Users should verify local rules before travel.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
