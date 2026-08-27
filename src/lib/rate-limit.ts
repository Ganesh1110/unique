type RateLimitRecord = { count: number; expiresAt: number };

const store = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding window rate limiter for API endpoints.
 * @param identifier - Key for tracking (e.g. IP or email)
 * @param limit - Maximum requests allowed in window
 * @param windowMs - Time window in milliseconds (default: 1 minute)
 */
export function checkRateLimit(identifier: string, limit = 10, windowMs = 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now > record.expiresAt) {
    store.set(identifier, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}
