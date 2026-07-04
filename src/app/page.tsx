import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import TrustNotice from "@/components/TrustNotice";
import WhatsAppButton from "@/components/WhatsAppButton";
import FaqAccordion from "@/components/FaqAccordion";
import { faqItems } from "@/content/faq";

const benefits = [
  { title: "Minimal inquiry process", text: "सुरुमा simple form मात्र भर्नुहोस् — लामो application छैन।" },
  { title: "License photo upload only", text: "पहिलो step मा driving license को photo मात्र चाहिन्छ।" },
  { title: "WhatsApp support", text: "Form पछि सबै support WhatsApp मै continue गर्न सकिन्छ।" },
  { title: "Digital & Printed IDP guidance", text: "Digital वा Printed — कुन ठीक हुन्छ, team ले guide गर्छ।" },
  { title: "Fast or normal delivery options", text: "Fast delivery वा normal (40–50 days estimate) रोज्न सकिन्छ।" },
  { title: "Educational guidance before payment", text: "Payment अगाडि नै process राम्रोसँग बुझाइन्छ।" },
];

const steps = [
  { n: 1, title: "Fill simple inquiry form", text: "Name, email, WhatsApp र destination country भर्नुहोस्।" },
  { n: 2, title: "Upload driving license photo", text: "License को front photo (JPG, PNG वा PDF) upload गर्नुहोस्।" },
  { n: 3, title: "Our team reviews your details", text: "हाम्रो team ले details check गरेर contact गर्छ।" },
  { n: 4, title: "Continue through WhatsApp or email", text: "बाँकी process WhatsApp वा email बाट अगाडि बढ्छ।" },
];

const seoSections = [
  {
    title: "What is an International Driving Permit?",
    text: "An International Driving Permit (IDP) generally works as a translation/support document for your valid national driving license. It helps foreign authorities, rental companies and insurance providers understand your license details in multiple languages. IDP सामान्यतया तपाईंको driving license को translation document हो — यसले license लाई replace गर्दैन।",
  },
  {
    title: "Is IDP a replacement for a driving license?",
    text: "No. An IDP does not replace your national driving license. You should always carry your valid driving license along with the IDP while driving abroad. विदेशमा drive गर्दा आफ्नो valid license सधैँ साथमा राख्नुहोस्।",
  },
  {
    title: "Who may need an IDP?",
    text: "People travelling abroad for work, study or tourism who plan to drive, rent a vehicle, or need a translated license document may need an IDP. Requirements differ by destination country, rental company, insurance provider and local authority — always verify local rules before travel.",
  },
  {
    title: "Digital IDP vs Printed IDP",
    text: "Digital IDP generally refers to a digital document or translation copy, while Printed IDP refers to a physical printed document/card/booklet depending on the processing option. Acceptance of digital vs printed documents may vary by destination and use case — our team can help you understand which option may suit your plan.",
  },
  {
    title: "What documents may be required?",
    text: "For the first inquiry you only need your name, email, WhatsApp number, destination country, license status and a photo of your driving license. If more documents are required (photo, passport copy, etc.), our team will request them later through WhatsApp or email.",
  },
  {
    title: "Why take assistance from Digital Solution?",
    text: "Digital Solution provides simple, honest guidance in Nepali-English so you understand the process before paying anything. We help you prepare documents, submit your inquiry, and follow up through WhatsApp or email — positioned as a helpful support team, not an issuing authority.",
  },
  {
    title: "Important disclaimer before applying",
    text: "Digital Solution is not a government authority and does not directly issue official International Driving Permits. Final approval, document type, validity, delivery time, and acceptance depend on the relevant issuing/processing body and destination-country rules.",
  },
];

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-accent-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:py-20">
          <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">
            International Driving Permit{" "}
            <span className="text-brand-600">Guide &amp; Assistance</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            विदेश यात्रा वा driving purpose को लागि IDP / International Driving Permit बारे
            बुझ्न, document prepare गर्न, र assistance request पठाउन Digital Solution ले
            सजिलो support दिन्छ।
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/apply" className="btn-primary w-full sm:w-auto">
              Get IDP Assistance
            </Link>
            <Link href="/track" className="btn-secondary w-full sm:w-auto">
              Track My Request
            </Link>
            <WhatsAppButton
              message="Hello Digital Solution, I want to know about IDP assistance."
              className="btn-whatsapp w-full sm:w-auto"
            />
          </div>
          <div className="mx-auto mt-10 max-w-3xl text-left">
            <TrustNotice />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="section-title text-center">Why Use Our Assistance?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="card">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{b.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="card">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl rounded-xl border border-slate-200 bg-white p-5 text-center text-sm leading-relaxed text-slate-600">
            पहिलो चरणमा धेरै details चाहिँदैन। Name, email, WhatsApp, जाने देश, license छ/छैन,
            package preference र license photo भए पुग्छ। बाँकी document चाहियो भने team ले
            WhatsApp वा email मार्फत माग्छ।
          </p>
          <div className="mt-8 text-center">
            <Link href="/apply" className="btn-primary">
              Submit Assistance Request
            </Link>
          </div>
        </div>
      </section>

      {/* SEO / education sections */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="section-title text-center">IDP Guide — Learn Before You Apply</h2>
        <div className="mt-8 space-y-6">
          {seoSections.map((s) => (
            <div key={s.title} className="card">
              <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ preview */}
      <section className="mx-auto max-w-4xl px-4 pb-14">
        <h2 className="section-title text-center">Frequently Asked Questions</h2>
        <div className="mt-8">
          <FaqAccordion items={faqItems.slice(0, 5)} />
        </div>
        <div className="mt-6 text-center">
          <Link href="/faq" className="text-sm font-semibold text-brand-600 hover:underline">
            View all FAQs →
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
