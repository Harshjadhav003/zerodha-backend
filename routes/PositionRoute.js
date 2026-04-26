const express = require("express");
const router = require("express").Router();
const authMiddleware = require("../middlewares/AuthMiddleware");
const rateLimiter = require("../middlewares/rateLimiter");

const {
  getPositions,
} = require("../controllers/PositionController");

router.get("/positions", authMiddleware, rateLimiter, getPositions);

module.exports = router;