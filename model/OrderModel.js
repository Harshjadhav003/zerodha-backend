const mongoose = require("mongoose");
const { OrderSchema } = require("../schema/OrderSchema");

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;