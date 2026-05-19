const redis = require("../config/redis");
const OrderModel = require("../models/OrderModel");
const HoldingModel = require("../models/HoldingModel");
const PositionModel = require("../models/PositionModel");

exports.createOrder = async (req, res) => {
  try {
    const io = req.app.get("io"); //  socket access

    let { name, qty, price, mode } = req.body;

    // =========================
    // 1. VALIDATION
    // =========================
    if (!name || !qty || !price || !mode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, qty, price, mode)",
      });
    }

    const normalizedMode = mode.toUpperCase();
    qty = Number(qty);
    price = Number(price);

    if (isNaN(qty) || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: "Quantity and price must be valid numbers",
      });
    }

    if (normalizedMode !== "BUY" && normalizedMode !== "SELL") {
      return res.status(400).json({
        success: false,
        message: "Mode must be either BUY or SELL",
      });
    }

    const userId = req.userId;

    // =========================
    // 2. EMIT PENDING (REAL-TIME)
    // =========================
    io.to(userId).emit("orderUpdate", {
      status: "PENDING",
      data: { name, qty, price, mode: normalizedMode },
    });

    // =========================
    // 3. CREATE ORDER
    // =========================
    const order = await OrderModel.create({
      name,
      qty,
      price,
      mode: normalizedMode,
      userId,
    });

    // =========================
    // 4. UPDATE HOLDINGS
    // =========================
    const holding = await HoldingModel.findOne({ userId, name });

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
          userId,
          name,
          qty,
          avg: price,
          price,
        });
      }
    }

    if (normalizedMode === "SELL") {
      if (!holding || holding.qty < qty) {
        //  emit rejection
        io.to(userId).emit("orderUpdate", {
          status: "REJECTED",
          message: "Not enough shares",
        });

        return res.status(400).json({
          success: false,
          message: "Not enough shares to sell",
        });
      }

      holding.qty -= qty;
      holding.price = price;

      if (holding.qty === 0) {
        await holding.deleteOne();
      } else {
        await holding.save();
      }
    }

    // =========================
    // 5. UPDATE POSITIONS
    // =========================
    let position = await PositionModel.findOne({ userId, name });

    if (!position) {
      await PositionModel.create({
        userId,
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

      // ===== BUY LOGIC =====
      if (normalizedMode === "BUY") {
        if (position.qty >= 0) {
          newAvg =
            (position.avg * position.qty + price * qty) /
            (position.qty + qty);
        } else {
          if (Math.abs(position.qty) > qty) {
            newAvg = position.avg;
          } else if (Math.abs(position.qty) === qty) {
            newAvg = 0;
          } else {
            newAvg = price;
          }
        }
      }

      // ===== SELL LOGIC =====
      if (normalizedMode === "SELL") {
        if (position.qty <= 0) {
          newAvg = position.avg;
        } else {
          if (position.qty > qty) {
            newAvg = position.avg;
          } else if (position.qty === qty) {
            newAvg = 0;
          } else {
            newAvg = price;
          }
        }
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
    // 6. CLEAR CACHE (FAIL-SAFE)
    // =========================
    try {
      await redis.del(`orders:${userId}`);
      await redis.del(`holdings:${userId}`);
      await redis.del(`positions:${userId}`);
    } catch (redisErr) {
      console.error("REDIS DEL ERROR:", redisErr);
    }

    // =========================
    // 7. EMIT SUCCESS EVENTS
    // =========================
    io.to(userId).emit("orderUpdate", {
      status: "EXECUTED",
      data: order,
    });

    io.to(userId).emit("holdings_update");
    io.to(userId).emit("positions_update");

    // =========================
    // 8. RESPONSE
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