import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import FaqAccordion from "@/components/FaqAccordion";
import { faqItems } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ — International Driving Permit Assistance Questions",
  description:
    "Frequently asked questions about IDP assistance in Nepal: digital vs printed IDP, delivery time, documents needed, pricing, tracking and WhatsApp support.",
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-base text-slate-600">
          IDP assistance बारे धेरै सोधिने प्रश्नहरू र सजिला उत्तरहरू।
        </p>
        <div className="mt-8">
          <FaqAccordion items={faqItems} />
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">अरू प्रश्न छ भने direct contact गर्नुहोस्।</p>
          <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
            <Link href="/apply" className="btn-primary">
              Get IDP Assistance
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
