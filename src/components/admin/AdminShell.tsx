"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
              DS
            </span>
            <span className="text-sm font-bold text-slate-900">Admin Dashboard</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-brand-600">
              Requests
            </Link>
            <Link
              href="/admin/change-password"
              className="text-sm font-medium text-slate-600 hover:text-brand-600"
            >
              Change Password
            </Link>
            <a
              href="/api/admin/export"
              className="text-sm font-medium text-slate-600 hover:text-brand-600"
            >
              Export CSV
            </a>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
