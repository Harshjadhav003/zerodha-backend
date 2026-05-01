const mongoose = require("mongoose");
const { Schema } = mongoose;

const HoldingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
  },
  { timestamps: true }
);

//  CREATE MODEL
const HoldingModel = mongoose.model("Holding", HoldingSchema);

//  EXPORT MODEL
module.exports = HoldingModel;