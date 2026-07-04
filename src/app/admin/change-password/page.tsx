"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not change password.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell title="Change Password">
      <div className="max-w-md">
        <p className="text-sm text-slate-600">
          If you signed in with a temporary password, you must set a new one before using
          the dashboard.
        </p>
        <form className="card mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="current" className="form-label">Current Password</label>
            <input
              id="current"
              type="password"
              className="form-input"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="new" className="form-label">New Password</label>
            <input
              id="new"
              type="password"
              className="form-input"
              required
              minLength={10}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <p className="form-help">At least 10 characters.</p>
          </div>
          <div>
            <label htmlFor="confirm" className="form-label">Confirm New Password</label>
            <input
              id="confirm"
              type="password"
              className="form-input"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
