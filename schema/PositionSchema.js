const mongoose = require("mongoose");
const { Schema } = mongoose;

const PositionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: String,
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
    isLoss: Boolean,
  },
  { timestamps: true }
);

const PositionModel = mongoose.model("Position", PositionSchema);

module.exports = PositionModel;