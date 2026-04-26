const HoldingModel = require("../model/HoldingModel");
const redis = require("../config/redis");

exports.getHoldings = async (req, res) => {
  try {
    const cacheKey = `holdings:${req.userId}`;

    // 1. Check cache
    const cacheData = await redis.get(cacheKey);

    if (cacheData) {
      console.log("CACHE HIT");
      return res.json({
        success: true,
        data: JSON.parse(cacheData),
      });
    }

    // 2. DB call
    console.log("DB HIT");
    const holdings = await HoldingModel.find({
      userId: req.userId,
    });

    // 3. Store in Redis
    await redis.setex(cacheKey, 60, JSON.stringify(holdings));

    res.json({
      success: true,
      data: holdings,
    });

  } catch (err) {
    console.log("HOLDINGS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
