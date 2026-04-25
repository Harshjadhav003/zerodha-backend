const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  let token = req.cookies?.token;

  // support header also
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

//  console.log(" TOKEN:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const data = jwt.verify(token, process.env.TOKEN_KEY);
    req.userId = data.id || data._id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};