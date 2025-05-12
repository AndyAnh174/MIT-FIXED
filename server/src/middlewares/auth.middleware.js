const jwt = require("jsonwebtoken");

const AuthMiddleware = {};

AuthMiddleware.isAuthenticated = (req, res, next) => {
  //console.log("isAuthenticated", req);

  const access_token = req.cookies.access_token;

  if (!access_token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default AuthMiddleware;
