import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-base font-bold text-slate-900">IDP Guide &amp; Assistance</p>
            <p className="mt-2 text-sm text-slate-600">
              Educational guidance and documentation assistance for International Driving
              Permit inquiries. Digital Solution does not directly issue official IDP
              documents.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Pages</p>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link className="text-slate-600 hover:text-brand-600" href="/how-it-works">How It Works</Link></li>
              <li><Link className="text-slate-600 hover:text-brand-600" href="/idp-guide">IDP Guide</Link></li>
              <li><Link className="text-slate-600 hover:text-brand-600" href="/required-documents">Required Documents</Link></li>
              <li><Link className="text-slate-600 hover:text-brand-600" href="/packages">Packages</Link></li>
              <li><Link className="text-slate-600 hover:text-brand-600" href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Support</p>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link className="text-slate-600 hover:text-brand-600" href="/apply">Submit Request</Link></li>
              <li><Link className="text-slate-600 hover:text-brand-600" href="/track">Track Request</Link></li>
              <li><Link className="text-slate-600 hover:text-brand-600" href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Legal</p>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link className="text-slate-600 hover:text-brand-600" href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link className="text-slate-600 hover:text-brand-600" href="/terms">Terms &amp; Conditions</Link></li>
              <li><Link className="text-slate-600 hover:text-brand-600" href="/disclaimer">Disclaimer</Link></li>
              <li><Link className="text-slate-600 hover:text-brand-600" href="/refund-policy">Refund &amp; Service Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <p>
            <a
              href={`https://${SITE.mainSite}`}
              className="font-medium text-brand-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Digital Solution
            </a>{" "}
            for more information
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Digital Solution. This website provides education,
            inquiry and assistance support only.
          </p>
        </div>
      </div>
    </footer>
  );
}
