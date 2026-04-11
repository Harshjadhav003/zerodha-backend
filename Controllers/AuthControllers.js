const User = require("../model/Usermodel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const Login = require("./AuthControllers.js");


// ================= SIGNUP =================
module.exports.Signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({ email, password, username });

    const token = createSecretToken(user._id);

    //  Set cookie
     res.cookie("token", token, {
         httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 3 * 24 * 60 * 60 * 1000,
});

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createSecretToken(user._id);

    // FIXED cookie
           res.cookie("token", token, {
           httpOnly: true,
           secure: true,
           sameSite: "None",
           maxAge: 3 * 24 * 60 * 60 * 1000,
         });

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================LOGOUT=================

module.exports.Logout = async (req ,res)=>{
   res.cookie("token", "", {
  httpOnly: true,
  expires: new Date(0),
  sameSite: "None",
  secure: true,
});
  return res.json({ success: true, message: "Logged out successfully" });
}