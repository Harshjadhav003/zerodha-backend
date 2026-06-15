const User = require("../models/Usermodel");
const { createSecretToken } = require("../utils/SecretToken");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("../middlewares/asyncHandler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// cookie config
const getCookieOptions = (req) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  return { 
    httpOnly: true, 
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  };
};

// VERIFY
exports.userVerification = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No Token Provided",
    });
  }

  const data = jwt.verify(token, process.env.TOKEN_KEY);

  const user = await User.findById(data.id);

  if (!user) {
   return next(new ErrorHandler("User not found", 404));
  }

  res.json({
    success: true,
    user: user.username,
  });
});

// SIGNUP
exports.Signup = asyncHandler(async (req, res, next) => {
  const { email, password, username } = req.body;

 if (!email || !password || !username) {
  return next(new ErrorHandler("All fields are required", 400));
}

  const existingUser = await User.findOne({ email });

if (existingUser) {
  return next(new ErrorHandler("User already exists", 400));
}

  const user = await User.create({
    email,
    password,
    username,
  });

  const token = createSecretToken(user._id);

  res.cookie("token", token, getCookieOptions(req));

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: userResponse,
    token,
  });
});
// LOGIN
exports.Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

if (!email || !password) {
  return next(new ErrorHandler("All fields are required", 400));
}

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
  return next(new ErrorHandler("User not found", 404));
}
  

  const isAuth = await bcrypt.compare(password, user.password);

 if (!isAuth) {
  return next(new ErrorHandler("Invalid email or password", 401));
}

  const token = createSecretToken(user._id);

  res.cookie("token", token, getCookieOptions(req));

  const userResponse = user.toObject();
  delete userResponse.password;

  res.json({
    success: true,
    message: "User logged in successfully",
    user: userResponse,
    token,
  });
});
// LOGOUT
exports.Logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", {
    ...getCookieOptions(req),
    expires: new Date(0),
  });
  res.json({ success: true ,message: "User Logged out Succesfully" });
});