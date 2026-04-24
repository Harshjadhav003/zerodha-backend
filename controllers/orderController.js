const OrderModel = require("../model/OrderModel");

exports.createOrder = async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    // validation
    if (!name || !qty || !price || !mode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const order = await OrderModel.create({
      name,
      qty,
      price,
      mode,
      userId: req.userId, //  important
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};