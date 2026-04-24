const HoldingModel = require("../model/HoldingModel");
const PositionModel = require("../model/PositionModel");
const OrderModel = require("../model/OrderModel");

exports.getHoldings = async (req, res) => {
  try {
    const data = await HoldingModel.find({});
    res.json({ success: true, data });
  } catch (err) {
    console.log("HOLDINGS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPositions = async (req, res) => {
  try {
    const data = await PositionModel.find({});
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const data = await OrderModel.find({});
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};