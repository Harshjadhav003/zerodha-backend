const mongoose = require("mongoose");
const { HoldingSchema } = require("../schema/HoldingSchema");

const HoldingModel = mongoose.model("Holding", HoldingSchema);

module.exports = HoldingModel;