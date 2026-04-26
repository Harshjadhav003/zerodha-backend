const User = require("../model/Usermodel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// cookie config
const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/", 
    maxAge: 3 * 24 * 60 * 60 * 1000,
  };
};
// VERIFY
exports.userVerification = async (req, res) => {
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
  } catch (err) {
    return res.json({ success: false });
  }
};

// SIGNUP
exports.Signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ email, password, username });

    const token = createSecretToken(user._id);
    res.cookie("token", token, getCookieOptions(req));

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, message: "User signed in successfully", user: userResponse });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// LOGIN
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, getCookieOptions(req));

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ success: true, message: "User logged in successfully", user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// LOGOUT
exports.Logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    expires: new Date(0),
  });
  res.json({ success: true });
};