import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service-role key.
// Never import this from client components.
let client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export const UPLOADS_BUCKET = "uploads";

export async function signedFileUrl(path: string, expiresInSeconds = 60 * 10) {
  const { data, error } = await supabaseAdmin()
    .storage.from(UPLOADS_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error) return null;
  return data.signedUrl;
}
