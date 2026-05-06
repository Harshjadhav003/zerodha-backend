const mongoose = require("mongoose");
const { HoldingSchema } = require("../schema/HoldingSchema");

module.exports = mongoose.model("Holding", HoldingSchema);