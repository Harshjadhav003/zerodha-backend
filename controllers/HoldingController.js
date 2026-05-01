const HoldingModel = require("../model/HoldingModel");
const redis = require("../config/redis");

exports.getHoldings = async (req, res) => {
  try {
    const cacheKey = `holdings:${req.userId}`;

    // 1. Check cache
    const cacheData = await redis.get(cacheKey);

    if (cacheData) {
      console.log("CACHE HIT");
      return res.json(JSON.parse(cacheData)); //  FIXED
    }

    // 2. DB call
    console.log("DB HIT");
    const holdings = await HoldingModel.find({
      userId: req.userId,
    });

    // 3. Prepare response
    const response = { success: true, data: holdings };

    // 4. Store in Redis
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

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