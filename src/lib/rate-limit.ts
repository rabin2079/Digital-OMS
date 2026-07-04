// Simple in-memory rate limiter. Good enough for a single-instance MVP;
// swap for Upstash/Redis if the app is scaled horizontally.
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 10 * 60 * 1000 }: { limit?: number; windowMs?: number } = {}
): { allowed: boolean } {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  entry.count += 1;
  if (hits.size > 5000) {
    // prevent unbounded growth
    for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
  }
  return { allowed: entry.count <= limit };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
