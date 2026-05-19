const mongoose = require("mongoose");
const OrderSchema = require("../schema/OrderSchema");

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);