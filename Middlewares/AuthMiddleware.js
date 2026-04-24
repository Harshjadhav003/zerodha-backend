const jwt = require("jsonwebtoken");
const User = require("../model/Usermodel");

module.exports.userVerification = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const data = jwt.verify(token, process.env.TOKEN_KEY);

    const userId = data.id || data._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("VERIFY ERROR:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const data = jwt.verify(token, process.env.TOKEN_KEY);
    req.userId = data.id; // attach user
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};