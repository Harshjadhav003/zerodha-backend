const jwt = require("jsonwebtoken");  //  ADD THIS
const User = require("../model/Usermodel");

module.exports.userVerification = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.json({ success: false });
    }

    const data = jwt.verify(token, process.env.TOKEN_KEY);

    const user = await User.findById(data.id);

    if (!user) {
      return res.json({ success: false });
    }

    return res.json({
      success: true,
      user: user.username,
    });

  } catch (error) {
    console.error("VERIFY ERROR:", error);  //  ADD THIS
    return res.json({ success: false });
  }
};