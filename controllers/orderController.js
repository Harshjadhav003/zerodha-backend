const OrderModel = require("../models/OrderModel");
const redis = require("../config/redis");

exports.getOrders = async (req, res) => {
  try {
    const cacheKey = `orders:${req.userId}`;

    const cacheData = await redis.get(cacheKey);

    if (cacheData) {
      console.log("CACHE HIT");
      return res.json(JSON.parse(cacheData));
    }

    console.log("DB HIT");

    const orders = await OrderModel.find({ userId: req.userId });

    const response = { success: true, data: orders };

    //  FIXED
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    res.json(response);

  } catch (err) {
    console.log("GET ORDERS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};