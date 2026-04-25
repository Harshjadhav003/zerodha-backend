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

module.exports = { HoldingSchema } ;