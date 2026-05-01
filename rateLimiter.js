const redis = require("../config/redis"); //  SAME INSTANCE

const rateLimiter = async (req, res, next) => {
  try {
    const key = `rate:${req.ip}`;

    const data = await redis.hgetall(key); //  works in ioredis

    console.log("Rate data:", data);

    next();
  } catch (err) {
    console.log("Rate limiter error:", err);
    next(); // don’t block request
  }
};

module.exports = rateLimiter;