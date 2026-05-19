const OrderModel = require("../models/OrderModel");
const redis = require("../config/redis");

exports.getOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
       return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cacheKey = `orders:${userId}`;

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

    console.log("DB HIT");

    const orders = await OrderModel.find({
      $or: [
        { userId: userId },
        { userId: { $exists: false } },
        { userId: null }
      ]
    });

    const response = { success: true, data: orders || [] };

    try {
      await redis.set(cacheKey, JSON.stringify(response), "EX", 60);
    } catch (redisErr) {
      console.error("REDIS SET ERROR:", redisErr);
    }

    res.json(response);

  } catch (err) {
    console.log("GET ORDERS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};