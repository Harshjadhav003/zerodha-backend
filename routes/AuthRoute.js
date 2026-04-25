console.log("🔥 Auth routes loaded");
const router = require("express").Router();
const rateLimiter = require("../middlewares/rateLimiter");

const { Signup, Login, Logout, userVerification } = require("../controllers/AuthController");

router.post("/signup", Signup);
router.post("/login", rateLimiter, Login);
router.get("/verify", userVerification);  //  controller
router.post("/logout", Logout);

module.exports = router;