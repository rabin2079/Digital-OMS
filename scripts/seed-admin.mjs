#!/usr/bin/env node
/**
 * Seed (or reset) the initial admin user.
 *
 * Usage:
 *   ADMIN_EMAIL=mail@digitalsolutionnepal.com ADMIN_INITIAL_PASSWORD=... npm run seed:admin
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY from the
 * environment (or .env / .env.local in the project root).
 *
 * The seeded account has must_change_password=true, so the admin is
 * forced to set a new password on first login.
 */
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Minimal .env loader so the script works without extra deps.
for (const file of [".env.local", ".env"]) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
const password = process.env.ADMIN_INITIAL_PASSWORD;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
if (!email || !password) {
  console.error("Missing ADMIN_EMAIL or ADMIN_INITIAL_PASSWORD.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("ADMIN_INITIAL_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const password_hash = await bcrypt.hash(password, 12);

const { data: existing, error: selectError } = await db
  .from("admin_users")
  .select("id")
  .eq("email", email)
  .maybeSingle();

if (selectError) {
  console.error("Could not query admin_users:", selectError.message);
  process.exit(1);
}

if (existing) {
  const { error } = await db
    .from("admin_users")
    .update({ password_hash, must_change_password: true })
    .eq("id", existing.id);
  if (error) {
    console.error("Could not update admin:", error.message);
    process.exit(1);
  }
  console.log(`Admin ${email} password reset. They must change it on next login.`);
} else {
  const { error } = await db.from("admin_users").insert({
    email,
    password_hash,
    role: "admin",
    must_change_password: true,
  });
  if (error) {
    console.error("Could not create admin:", error.message);
    process.exit(1);
  }
  console.log(`Admin ${email} created. They must change the password on first login.`);
}
