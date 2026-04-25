const router = require("express").Router();
const authMiddleware = require("../middlewares/AuthMiddleware");

const { createOrder } = require("../controllers/orderController");

router.post("/orders", authMiddleware, createOrder);

module.exports = router;