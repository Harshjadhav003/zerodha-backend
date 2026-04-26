const express = require("express");
const router = require("express").Router();
const authMiddleware = require("../middlewares/AuthMiddleware");
const rateLimiter = require("../middlewares/rateLimiter");

const {
  getHoldings,
} = require("../controllers/HoldingController");

router.get("/holdings", authMiddleware, rateLimiter, getHoldings);

module.exports = router;