const mongoose = require("mongoose");
const { OrderSchema } = require("../schema/OrderSchema");

module.exports = mongoose.model("Order", OrderSchema);