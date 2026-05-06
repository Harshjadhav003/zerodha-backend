const PositionModel = require("../models/PositionModel");
const redis = require("../config/redis");

exports.getPositions = async (req, res) => {
  try {
    const cacheKey = `positions:${req.userId}`;

    // 1. Check cache
    const cacheData = await redis.get(cacheKey);

    if (cacheData) {
      console.log("CACHE HIT");
      return res.json(JSON.parse(cacheData)); //  fixed
    }

    console.log("DB HIT");

    // 2. DB call
    const positions = await PositionModel.find({ userId: req.userId });

    // 3. Prepare response
    const response = {
      success: true,
      data: positions,
    };

    // 4. Store in Redis
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60); // ✅ fixed

    // 5. Send response
    res.json(response);

  } catch (err) {
    console.log("POSITIONS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};