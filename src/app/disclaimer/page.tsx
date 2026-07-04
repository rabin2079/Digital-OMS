import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer: Digital Solution is not a government IDP authority. This website provides education, inquiry and assistance support for International Driving Permit topics.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      intro="Please read this disclaimer carefully before submitting an assistance request."
      sections={[
        {
          title: "1. Not a government authority",
          paragraphs: [
            "Digital Solution is not a government IDP authority and is not affiliated with any government body that issues driving permits or licenses.",
          ],
        },
        {
          title: "2. No direct issuance",
          paragraphs: [
            "Digital Solution does not directly issue official government International Driving Permits. We provide education, guidance, documentation support and application assistance based on user inquiry.",
          ],
        },
        {
          title: "3. Acceptance depends on destination",
          paragraphs: [
            "IDP/document acceptance depends on destination-country rules, rental companies, insurance providers and local authorities. Digital and printed document acceptance may vary by destination and use case.",
          ],
        },
        {
          title: "4. Carry your driving license",
          paragraphs: [
            "Users should always carry their valid national driving license while driving abroad. An IDP or translation document generally supports — and does not replace — your national driving license.",
          ],
        },
        {
          title: "5. Purpose of this website",
          paragraphs: [
            "This website is for education, inquiry and assistance. Final approval, document type, validity, delivery time and acceptance depend on the relevant issuing/processing body and destination-country rules.",
          ],
        },
      ]}
    />
  );
}
