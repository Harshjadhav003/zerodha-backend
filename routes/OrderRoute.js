const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

const { createOrder } = require("../controllers/OrderController");

router.post("/orders", authMiddleware, createOrder);

module.exports = router;