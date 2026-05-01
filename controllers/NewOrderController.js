const redis = require("../config/redis");
const OrderModel = require("../model/OrderModel");
const HoldingModel = require("../model/HoldingModel");
const PositionModel = require("../model/PositionModel");

exports.createOrder = async (req, res) => {
  try {
    let { name, qty, price, mode } = req.body;

    // 🔥 normalize + convert
    const normalizedMode = mode.toUpperCase();
    qty = Number(qty);
    price = Number(price);

    if (!name || !qty || !price || !normalizedMode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // =========================
    // 1. CREATE ORDER
    // =========================
    const order = await OrderModel.create({
      name,
      qty,
      price,
      mode: normalizedMode,
      userId: req.userId,
    });

    // =========================
    // 2. UPDATE HOLDINGS
    // =========================
    const holding = await HoldingModel.findOne({
      userId: req.userId,
      name,
    });

    if (normalizedMode === "BUY") {
      if (holding) {
        const totalQty = holding.qty + qty;

        const newAvg =
          (holding.avg * holding.qty + price * qty) / totalQty;

        holding.qty = totalQty;
        holding.avg = newAvg;
        holding.price = price;

        await holding.save();
      } else {
        await HoldingModel.create({
          userId: req.userId,
          name,
          qty,
          avg: price,
          price,
        });
      }
    }

    if (normalizedMode === "SELL") {
      if (holding) {
        holding.qty -= qty;
        holding.price = price;

        if (holding.qty <= 0) {
          await holding.deleteOne();
        } else {
          await holding.save();
        }
      }
    }

    // =========================
    // 3. UPDATE POSITIONS
    // =========================
    let position = await PositionModel.findOne({
      userId: req.userId,
      name,
    });

    if (!position) {
      await PositionModel.create({
        userId: req.userId,
        name,
        qty: normalizedMode === "BUY" ? qty : -qty,
        avg: price,
        price,
      });
    } else {
      let newQty =
        normalizedMode === "BUY"
          ? position.qty + qty
          : position.qty - qty;

      let newAvg = position.avg;

      if (normalizedMode === "BUY") {
        newAvg =
          (position.avg * position.qty + price * qty) /
          (position.qty + qty);
      }

      position.qty = newQty;
      position.avg = newAvg;
      position.price = price;

      if (position.qty === 0) {
        await position.deleteOne();
      } else {
        await position.save();
      }
    }

    // =========================
    // 4. CLEAR CACHE
    // =========================
    await redis.del(`orders:${req.userId}`);
    await redis.del(`holdings:${req.userId}`);
    await redis.del(`positions:${req.userId}`);

    // =========================
    // 5. RESPONSE
    // =========================
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });

  } catch (err) {
    console.log("CREATE ORDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};