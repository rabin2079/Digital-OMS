import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Refund & Service Policy",
  description:
    "Refund and service policy for Digital Solution IDP assistance: refund terms are confirmed during WhatsApp/email communication before payment.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Service Policy"
      intro="This policy explains how refunds and service charges are handled for IDP assistance requests."
      sections={[
        {
          title: "1. Pricing is confirmed before payment",
          paragraphs: [
            "Since pricing is not fixed on this website, the exact service charge and the refund terms for your case are confirmed during WhatsApp/email communication before you make any payment.",
          ],
        },
        {
          title: "2. Before processing starts",
          paragraphs: [
            "If processing has not started, a refund may be possible based on case review. Contact our team as early as possible if you want to cancel.",
          ],
        },
        {
          title: "3. After costs are incurred",
          paragraphs: [
            "If processing partner, courier or service costs have already been incurred for your request, the refund may be partial or may not be available, depending on the costs already spent.",
          ],
        },
        {
          title: "4. Transparent communication",
          paragraphs: [
            "The final refund decision for each case is communicated transparently through WhatsApp or email, including the reason and any deducted costs.",
          ],
        },
      ]}
    />
  );
}
