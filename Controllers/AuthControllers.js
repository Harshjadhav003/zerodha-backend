const User = require("../model/Usermodel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

// Helper for cookie config
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction, //  false in dev
    sameSite: isProduction ? "None" : "Lax", //  key change
    maxAge: 3 * 24 * 60 * 60 * 1000,
  };
};

// ================= SIGNUP =================
module.exports.Signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validation
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }


    // Create user
    const user = await User.create({
      email,
      password ,
      username,
    });

    // Create token
    const token = createSecretToken(user._id);

    // Set cookie
    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN =================
module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check user
   const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create token
    const token = createSecretToken(user._id);

    // Set cookie
    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//================= LOGOUT =================
module.exports.Logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      expires: new Date(0), //  this deletes cookie
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};