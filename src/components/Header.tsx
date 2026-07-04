"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/idp-guide", label: "IDP Guide" },
  { href: "/required-documents", label: "Documents" },
  { href: "/packages", label: "Packages" },
  { href: "/faq", label: "FAQ" },
  { href: "/track", label: "Track Request" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            DS
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-slate-900 sm:text-base">
              IDP Guide &amp; Assistance
            </span>
            <span className="block text-xs text-brand-600">by Digital Solution</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/apply" className="btn-primary !px-4 !py-2 text-sm">
            Get Assistance
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-lg border border-slate-300 p-2 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 pb-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block border-b border-slate-100 py-3 text-base font-medium text-slate-700"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/apply" className="btn-primary mt-4 w-full" onClick={() => setOpen(false)}>
            Get IDP Assistance
          </Link>
        </nav>
      )}
    </header>
  );
}
