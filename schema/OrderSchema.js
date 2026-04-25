const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  name: String,
  qty: Number,
  price: Number,
  mode: String, // BUY or SELL
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = { OrderSchema };