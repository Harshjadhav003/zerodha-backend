const OrderModel = require("../model/OrderModel");
const redis = require("../config/redis");

exports.getOrders = async (req, res) => {
  try {
    const cacheKey = `orders:${req.userId}`;

    const cacheData = await redis.get(cacheKey);

    if (cacheData) {
      console.log("ORDERS CACHE HIT");
      return res.json(JSON.parse(cacheData));
    }

    console.log("DB HIT");

    const orders = await OrderModel.find({ userId: req.userId });

    const response = { success: true, data: orders };

    await redis.setex(cacheKey, 60, JSON.stringify(response));

    res.json(response);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};