const express = require("express");
const router = require("express").Router();
const authMiddleware = require("../middlewares/AuthMiddleware");
const rateLimiter = require("../middlewares/rateLimiter");

const {
  getHoldings,
  getPositions,
  getOrders,
} = require("../controllers/dataController");

router.get("/orders", authMiddleware, rateLimiter, getOrders);
router.get("/holdings", authMiddleware, rateLimiter, getHoldings);
router.get("/positions", authMiddleware, rateLimiter, getPositions);

module.exports = router;