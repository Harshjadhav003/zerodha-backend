const User = require("../model/Usermodel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// cookie config
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  };
};

// VERIFY
exports.userVerification = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) return res.json({ success: false });

    const data = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(data.id);

    if (!user) return res.json({ success: false });

    return res.json({
      success: true,
      user: user.username,
    });
  } catch {
    return res.json({ success: false });
  }
};

// SIGNUP
exports.Signup = async (req, res) => {
  const { email, password, username } = req.body;

  const user = await User.create({ email, password, username });

  const token = createSecretToken(user._id);
  res.cookie("token", token, getCookieOptions());

  res.status(201).json({ success: true, user });
};

// LOGIN
exports.Login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  const isAuth = await bcrypt.compare(password, user.password);
  if (!isAuth) return res.status(400).json({ message: "Invalid" });

  const token = createSecretToken(user._id);
  res.cookie("token", token, getCookieOptions());

  res.json({ success: true, user });
};

// LOGOUT
exports.Logout = async (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.json({ success: true });
};