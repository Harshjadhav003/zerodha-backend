const redis = require("../config/redis");

const RATE_LIMITS = {
  "/orders": { capacity: 10, refillRate: 5 },       // 10 tokens max, 5/sec
  "/holdings": { capacity: 50, refillRate: 20 }, 
  "/positions": { capacity: 50, refillRate: 20 },     // market data
  "/login": { capacity: 5, refillRate: 1 },
};

async function rateLimiter(req, res, next) {
  try {
    const userId = req.userId || req.ip; // fallback to IP
    const endpoint = req.route?.path || req.path;

    const config = RATE_LIMITS[endpoint] || {
      capacity: 20,
      refillRate: 10,
    };

    const key = `rate:${userId}:${endpoint}`;
    const now = Date.now() / 1000;

    let data = await redis.hgetall(key);

    let tokens = data.tokens ? parseFloat(data.tokens) : config.capacity;
    let last = data.last ? parseFloat(data.last) : now;

    // refill tokens
    const elapsed = now - last;
    tokens = Math.min(config.capacity, tokens + elapsed * config.refillRate);

    if (tokens < 1) {
      return res.status(429).json({
        success: false,
        message: "Too many requests ",
      });
    }

    tokens -= 1;

    await redis.hmset(key, {
      tokens,
      last: now,
    });

    // auto expire key
    await redis.expire(key, 60);

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    next(); // fail-open (important in trading systems)
  }
}

module.exports = rateLimiter;