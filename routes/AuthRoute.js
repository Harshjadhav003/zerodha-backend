const router = require("express").Router();

const { Signup, Login, Logout, userVerification } = require("../controllers/AuthController");

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/verify", userVerification);  //  controller
router.post("/logout", Logout);

module.exports = router;