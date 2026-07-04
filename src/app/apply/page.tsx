import type { Metadata } from "next";
import PublicLayout from "@/components/PublicLayout";
import ApplyForm from "./ApplyForm";

export const metadata: Metadata = {
  title: "IDP Assistance Request Form",
  description:
    "Submit a simple IDP assistance request: name, email, WhatsApp, destination country and driving license photo. Continue support through WhatsApp or email.",
};

export default function ApplyPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <ApplyForm />
      </div>
    </PublicLayout>
  );
}
