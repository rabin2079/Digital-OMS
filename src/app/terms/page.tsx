import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using the IDP Guide & Assistance platform by Digital Solution: assistance-only service, user responsibilities and service timelines.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="By using this website and submitting an inquiry, you agree to the following terms."
      sections={[
        {
          title: "1. Assistance service only",
          paragraphs: [
            "This platform provides education, guidance, documentation support and application assistance for International Driving Permit related inquiries. Digital Solution does not directly issue official government IDP documents.",
          ],
        },
        {
          title: "2. Correct details",
          paragraphs: [
            "You must submit correct, complete and truthful details, including your real name, contact information and genuine driving license documents.",
          ],
        },
        {
          title: "3. False documents",
          paragraphs: [
            "Submitting false, edited or invalid documents may lead to cancellation of your request without refund of any costs already incurred, and we may refuse further service.",
          ],
        },
        {
          title: "4. Service timeline",
          paragraphs: [
            "Service and delivery timelines can vary depending on processing partner, issuing body, courier service and destination. Estimates such as “40–50 days” are estimates only and are not guaranteed.",
          ],
        },
        {
          title: "5. No guarantee of acceptance",
          paragraphs: [
            "Digital Solution does not guarantee approval, legal acceptance or recognition of any document in any destination country. Final acceptance depends on the relevant issuing/processing body, destination-country rules, rental companies, insurance providers and local authorities.",
          ],
        },
        {
          title: "6. Your responsibility before travel",
          paragraphs: [
            "You must verify travel and driving rules of your destination country before using any document, and you should always carry your valid national driving license while driving abroad.",
          ],
        },
      ]}
    />
  );
}
