import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for the IDP Guide & Assistance platform by Digital Solution: how your personal data and license photo are used, shared and protected.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This Privacy Policy explains how Digital Solution collects and uses the information you submit on this IDP guide and assistance platform."
      sections={[
        {
          title: "1. Information you provide",
          paragraphs: [
            "You voluntarily submit personal data such as your name, email address, WhatsApp number, destination country, license details, driving license photo, optional payment receipt, and any message you write in the inquiry form.",
            "You are not required to create an account to submit an inquiry.",
          ],
        },
        {
          title: "2. How we use your data",
          paragraphs: [
            "Your data is used for handling your inquiry, providing assistance and guidance, communicating with you through WhatsApp or email, and supporting document processing that you request.",
            "We do not sell your personal data.",
          ],
        },
        {
          title: "3. Sharing with partners",
          paragraphs: [
            "Your data may be shared with processing/assistance partners only when it is required to deliver the service you requested (for example, forwarding your license details to a processing partner after you confirm you want to proceed).",
          ],
        },
        {
          title: "4. File uploads",
          paragraphs: [
            "License photos and payment receipts are stored in private storage and are not publicly accessible. Files are only viewed by our team for the purpose of handling your request, and any download link for your document is shown to you only after our team marks it as available.",
          ],
        },
        {
          title: "5. Data deletion",
          paragraphs: [
            `You can request deletion of your data at any time by contacting us at ${SITE.email} or through WhatsApp. We will remove your request record and uploaded files unless we are required to keep them for a legitimate legal reason.`,
          ],
        },
        {
          title: "6. Security",
          paragraphs: [
            "Digital Solution takes reasonable technical and organizational security measures to protect your data, including private file storage, restricted admin access and encrypted connections. No internet system can be 100% secure, so please only submit the documents requested.",
          ],
        },
      ]}
    />
  );
}
