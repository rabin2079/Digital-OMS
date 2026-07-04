export const SITE = {
  name: "IDP Guide & Assistance by Digital Solution",
  shortName: "Digital Solution",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://idp.digitalsolutionnepal.com",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "mail@digitalsolutionnepal.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  mainSite: "digitalsolutionnepal.com",
};

export const REQUEST_STATUSES = [
  "New Request",
  "Contacted",
  "Need More Details",
  "License Photo Received",
  "Document Pending",
  "Payment Pending",
  "Payment Received",
  "In Process",
  "Submitted to Processing Partner",
  "Download Ready",
  "Printed Document Pending",
  "Dispatched",
  "Completed",
  "Cancelled",
  "Rejected",
] as const;

export const PAYMENT_STATUSES = [
  "Not Required Yet",
  "Pending",
  "Receipt Uploaded",
  "Verified",
  "Failed",
  "Refunded",
] as const;

export const LICENSE_OPTIONS = [
  "Yes, I have a valid license",
  "No, I need guidance first",
  "Not sure",
] as const;

export const IDP_TYPE_OPTIONS = [
  "Digital IDP",
  "Printed IDP",
  "Both Digital and Printed",
  "Not sure, need guidance",
] as const;

export const VALIDITY_OPTIONS = ["1 Year", "2 Years", "3 Years", "Not sure"] as const;

export const DELIVERY_OPTIONS = [
  "Fast Delivery",
  "Normal Delivery: 40–50 days estimate",
  "Digital only",
  "Not sure",
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  "QR Payment",
  "Bank Transfer",
  "eSewa",
  "Khalti",
  "Other",
] as const;

export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];
export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const TRUST_NOTICE =
  "Digital Solution does not directly issue official International Driving Permits. We provide education, guidance, documentation support, and application assistance based on user inquiry. Final validity and acceptance depend on the issuing/processing body and destination-country rules.";
