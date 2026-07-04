import { TRUST_NOTICE } from "@/lib/constants";

export default function TrustNotice({ text = TRUST_NOTICE }: { text?: string }) {
  return (
    <div className="rounded-xl border border-accent-100 bg-accent-50 p-5">
      <div className="flex gap-3">
        <svg
          className="mt-0.5 h-6 w-6 shrink-0 text-accent-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="text-sm font-semibold text-slate-900">Important Notice</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{text}</p>
        </div>
      </div>
    </div>
  );
}
