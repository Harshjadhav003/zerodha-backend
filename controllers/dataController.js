const HoldingModel = require("../model/HoldingModel");
const PositionModel = require("../model/PositionModel");
const OrderModel = require("../model/OrderModel");
exports.getHoldings = async (req, res) => {
  try {
    const holdings = await HoldingModel.find({ userId: req.userId });
    res.json({ success: true, data: holdings }); //  FIX
  } catch (err) {
    console.log("HOLDINGS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPositions = async (req, res) => {
  try {
    const positions = await PositionModel.find({ userId: req.userId });
    res.json({ success: true, data: positions }); //  FIX
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.userId });
    res.json({ success: true, data: orders }); // FIX
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};