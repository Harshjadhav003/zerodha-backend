const HoldingModel = require("../models/HoldingModel");
const redis = require("../config/redis");

exports.getHoldings = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
       return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cacheKey = `holdings:${userId}`;

    // 1. Check cache (fail-safe)
    let cacheData;
    try {
      cacheData = await redis.get(cacheKey);
    } catch (redisErr) {
      console.error("REDIS GET ERROR:", redisErr);
    }

    if (cacheData) {
      console.log("CACHE HIT");
      return res.json(JSON.parse(cacheData));
    }

    // 2. DB call
    console.log("DB HIT");
    const holdings = await HoldingModel.find({
      $or: [
        { userId: userId },
        { userId: { $exists: false } },
        { userId: null }
      ]
    });

    // 3. Prepare response
    const response = { success: true, data: holdings || [] };

    // 4. Store in Redis (fail-safe)
    try {
      await redis.set(cacheKey, JSON.stringify(response), "EX", 60);
    } catch (redisErr) {
      console.error("REDIS SET ERROR:", redisErr);
    }

    // 5. Send response
    res.json(response);

  } catch (err) {
    console.log("HOLDINGS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};