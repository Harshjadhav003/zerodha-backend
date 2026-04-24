const mongoose = require("mongoose");
const { PositionSchema } = require("../schema/PositionSchema");

const PositionModel = mongoose.model("Position", PositionSchema);

module.exports = PositionModel;