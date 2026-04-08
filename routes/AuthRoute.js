const { Signup, Login ,Logout } = require("../Controllers/AuthControllers");
const { userVerification } = require("../Middlewares/AuthMiddleware");

const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", userVerification);
router.post("/logout", Logout);

module.exports = router;