const mongoose = require("mongoose");
const { PositionSchema } = require("../schema/PositionSchema");

module.exports = mongoose.model("Position", PositionSchema);