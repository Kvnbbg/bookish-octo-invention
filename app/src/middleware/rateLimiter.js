export default function rateLimiter({ windowMs = 15 * 60 * 1000, max = 100 } = {}) {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const cutoff = now - windowMs;
    const key = req.ip || req.connection?.remoteAddress || 'global';

    const requestTimes = hits.get(key) || [];
    const recent = requestTimes.filter((time) => time > cutoff);
    recent.push(now);
    hits.set(key, recent);

    if (recent.length > max) {
      res.status(429).json({ error: 'Too many requests, please slow down.' });
      return;
    }

    if (hits.size > 10_000) {
      for (const [entryKey, timestamps] of hits.entries()) {
        if (timestamps[timestamps.length - 1] < cutoff) {
          hits.delete(entryKey);
        }
      }
    }

    next();
  };
}
