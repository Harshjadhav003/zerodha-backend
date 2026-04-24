const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  getHoldings,
  getPositions,
  getOrders,
} = require("../controllers/DataController");

router.get("/holdings", authMiddleware, getHoldings);
router.get("/positions", authMiddleware, getPositions);
router.get("/orders", authMiddleware, getOrders);

module.exports = router;