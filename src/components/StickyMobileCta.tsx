import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp";

/** Sticky bottom bar on mobile: Get Assistance + WhatsApp. */
export default function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] sm:hidden">
      <div className="flex gap-2">
        <Link href="/apply" className="btn-primary flex-1 !px-3 text-sm">
          Get Assistance
        </Link>
        <a
          href={whatsappLink("Hello Digital Solution, I want to know about IDP assistance.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp flex-1 !px-3 text-sm"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
