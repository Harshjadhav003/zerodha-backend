const express = require("express");
const router = require("express").Router();
const authMiddleware = require("../middlewares/AuthMiddleware");
const rateLimiter = require("../middlewares/rateLimiter");


const {
  getOrders,
} = require("../controllers/OrderController");

router.get("/orders", authMiddleware, rateLimiter, getOrders);

module.exports = router;