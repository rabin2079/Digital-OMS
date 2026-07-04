import type { Metadata } from "next";
import { Suspense } from "react";
import PublicLayout from "@/components/PublicLayout";
import TrackForm from "./TrackForm";

export const metadata: Metadata = {
  title: "Track Request — Check Your IDP Assistance Status",
  description:
    "Track your IDP assistance request using your Request ID and WhatsApp number or email. See current status, admin messages and download availability.",
};

export default function TrackPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Track My Request</h1>
        <p className="mt-2 text-sm text-slate-600">
          Request ID र form भर्दा प्रयोग गरेको WhatsApp number वा email हालेर status check
          गर्नुहोस्।
        </p>
        <Suspense>
          <TrackForm />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
