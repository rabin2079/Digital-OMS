import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  LICENSE_OPTIONS,
  IDP_TYPE_OPTIONS,
  VALIDITY_OPTIONS,
  DELIVERY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "./constants";

/** Strip control chars and angle brackets, collapse whitespace, cap length. */
export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
}

export function isOneOf(value: string, options: readonly string[]): boolean {
  return options.includes(value);
}

export interface FileCheckResult {
  ok: boolean;
  error?: string;
}

export function checkUploadFile(file: File): FileCheckResult {
  if (file.size === 0) return { ok: false, error: "Empty file." };
  if (file.size > MAX_FILE_SIZE) return { ok: false, error: "File is larger than 10MB." };
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { ok: false, error: "Only JPG, PNG or PDF files are allowed." };
  }
  return { ok: true };
}

export function safeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
  return base || "file";
}

export interface LeadInput {
  full_name: string;
  email: string;
  whatsapp_number: string;
  destination_country: string;
  has_valid_license: string;
  license_issue_country: string;
  preferred_idp_type: string;
  validity_preference: string;
  delivery_preference: string;
  message: string;
  consent_accepted: boolean;
  payment_option: string; // "whatsapp_first" | "already_paid"
  payment_method: string;
  transaction_id: string;
}

export function validateLead(form: FormData): { data?: LeadInput; error?: string } {
  const data: LeadInput = {
    full_name: sanitizeText(form.get("full_name"), 120),
    email: sanitizeText(form.get("email"), 254),
    whatsapp_number: sanitizeText(form.get("whatsapp_number"), 20),
    destination_country: sanitizeText(form.get("destination_country"), 80),
    has_valid_license: sanitizeText(form.get("has_valid_license"), 60),
    license_issue_country: sanitizeText(form.get("license_issue_country"), 80),
    preferred_idp_type: sanitizeText(form.get("preferred_idp_type"), 60),
    validity_preference: sanitizeText(form.get("validity_preference"), 30),
    delivery_preference: sanitizeText(form.get("delivery_preference"), 60),
    message: sanitizeText(form.get("message"), 2000),
    consent_accepted: form.get("consent_accepted") === "on" || form.get("consent_accepted") === "true",
    payment_option: sanitizeText(form.get("payment_option"), 30) || "whatsapp_first",
    payment_method: sanitizeText(form.get("payment_method"), 30),
    transaction_id: sanitizeText(form.get("transaction_id"), 100),
  };

  if (!data.full_name) return { error: "Full name is required." };
  if (!isValidEmail(data.email)) return { error: "A valid email address is required." };
  if (!isValidPhone(data.whatsapp_number)) return { error: "A valid WhatsApp number is required." };
  if (!data.destination_country) return { error: "Destination country is required." };
  if (!isOneOf(data.has_valid_license, LICENSE_OPTIONS))
    return { error: "Please select a license option." };
  if (!isOneOf(data.preferred_idp_type, IDP_TYPE_OPTIONS))
    return { error: "Please select a preferred IDP type." };
  if (!isOneOf(data.validity_preference, VALIDITY_OPTIONS))
    return { error: "Please select a validity preference." };
  if (!isOneOf(data.delivery_preference, DELIVERY_OPTIONS))
    return { error: "Please select a delivery preference." };
  if (!data.consent_accepted) return { error: "Please accept the consent checkbox." };

  if (data.payment_option === "already_paid") {
    if (!isOneOf(data.payment_method, PAYMENT_METHOD_OPTIONS))
      return { error: "Please select a payment method." };
  } else {
    data.payment_option = "whatsapp_first";
    data.payment_method = "";
    data.transaction_id = "";
  }

  return { data };
}
