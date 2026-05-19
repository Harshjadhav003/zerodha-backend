const mongoose = require("mongoose");
const PositionSchema = require("../schema/PositionSchema");

module.exports = mongoose.models.Position || mongoose.model("Position", PositionSchema);