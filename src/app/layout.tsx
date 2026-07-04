import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "International Driving Permit Assistance Nepal | Digital Solution",
    template: "%s | Digital Solution IDP Assistance",
  },
  description:
    "Get simple guidance and assistance for International Driving Permit / IDP documentation through Digital Solution. Submit your basic inquiry, upload license photo, and continue support through WhatsApp or email.",
  keywords: [
    "International Driving Permit Nepal",
    "IDP Nepal",
    "International Driving License Nepal",
    "IDP assistance Nepal",
    "Digital Solution IDP",
    "International driving permit guide Nepal",
    "Driving license translation support Nepal",
    "IDP for Nepali license holders",
    "Digital IDP assistance",
    "Printed IDP assistance",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "International Driving Permit Assistance Nepal | Digital Solution",
    description:
      "Simple guidance and documentation assistance for International Driving Permit / IDP. Digital Solution helps you understand and prepare the process.",
    url: SITE.url,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
