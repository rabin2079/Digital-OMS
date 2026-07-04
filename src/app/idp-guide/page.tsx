import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import TrustNotice from "@/components/TrustNotice";

export const metadata: Metadata = {
  title: "IDP Guide — International Driving Permit Explained (Nepali-English)",
  description:
    "Simple Nepali-English guide to the International Driving Permit (IDP): what it is, digital vs printed, who may need it, and important rules before travelling abroad from Nepal.",
};

const points = [
  {
    title: "IDP is a translation/support document",
    text: "IDP generally works as a translation/support document for your valid national driving license. यसले तपाईंको license को details अन्तर्राष्ट्रिय भाषामा बुझाउन मद्दत गर्छ।",
  },
  {
    title: "IDP does not replace your driving license",
    text: "It does not replace your national driving license. IDP भनेको license को सट्टा होइन — यो license सँगै प्रयोग हुने document हो।",
  },
  {
    title: "Always carry your valid driving license",
    text: "Users should carry their valid driving license while driving abroad. विदेशमा drive गर्दा आफ्नो valid license सधैँ साथमा राख्नुहोस्।",
  },
  {
    title: "Rules differ by destination",
    text: "Requirements differ by destination country, rental company, insurance provider, and local authority. जाने देश अनुसार नियम फरक हुन्छ — travel अगाडि local rules verify गर्नुहोस्।",
  },
  {
    title: "Digital vs Printed acceptance varies",
    text: "Digital IDP and printed IDP acceptance may vary depending on destination and use case. कुन option ठीक हुन्छ भनेर हाम्रो team ले guide गर्न सक्छ।",
  },
  {
    title: "How Digital Solution helps",
    text: "Digital Solution helps users understand the process, prepare documents, and continue the next step through WhatsApp/email. हामी process बुझाउने र document prepare गर्न सहयोग गर्ने support team हौँ।",
  },
  {
    title: "No guarantee of approval",
    text: "Digital Solution is not a government authority and does not guarantee approval, legal acceptance, or travel eligibility. Final decision issuing/processing body र destination-country rules मा भर पर्छ।",
  },
];

export default function IdpGuidePage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          IDP Guide — International Driving Permit के हो?
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          विदेशमा drive गर्नु अघि IDP बारे बुझ्नु जरुरी छ। तलका point हरूले तपाईंलाई
          सजिलो भाषामा IDP को concept बुझ्न मद्दत गर्छन्।
        </p>

        <div className="mt-8 space-y-4">
          {points.map((p) => (
            <div key={p.title} className="card">
              <h2 className="text-lg font-semibold text-slate-900">{p.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <TrustNotice />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/apply" className="btn-primary">
            Get IDP Assistance
          </Link>
          <Link href="/required-documents" className="btn-secondary">
            See Required Documents
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
