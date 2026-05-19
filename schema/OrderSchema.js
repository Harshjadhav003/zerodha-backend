const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  mode: {
    type: String,
    required: true,
    enum: ["BUY", "SELL"],
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "CANCELLED"],
    default: "PENDING",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
}, { timestamps: true });

module.exports = OrderSchema;