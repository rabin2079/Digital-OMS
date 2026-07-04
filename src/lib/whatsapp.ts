import { SITE } from "./constants";

export function whatsappLink(message?: string): string {
  const number = SITE.whatsappNumber;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  // Without a configured number, wa.me still opens WhatsApp's generic screen.
  return number ? `https://wa.me/${number}${text}` : `https://wa.me/${text ? text : ""}`;
}

export function requestWhatsappMessage(req: {
  request_id: string;
  full_name: string;
  destination_country: string;
  preferred_idp_type: string;
}): string {
  return [
    "Hello Digital Solution, I submitted an IDP assistance request.",
    `Request ID: ${req.request_id}`,
    `Name: ${req.full_name}`,
    `Destination: ${req.destination_country}`,
    `Preferred Type: ${req.preferred_idp_type}`,
  ].join("\n");
}
