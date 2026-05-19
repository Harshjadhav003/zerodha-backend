const mongoose = require("mongoose");
const HoldingSchema = require("../schema/HoldingSchema");

module.exports = mongoose.models.Holding || mongoose.model("Holding", HoldingSchema);