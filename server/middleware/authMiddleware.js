import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        message: "No access token",
        success: false,
      });
    }

    const decoded = jwt.verify(accessToken, process.env.SECRET_ACCESSTOKEN_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
};

export const authorizeMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Not authorized",
        success: false,
      });
    }
    next();
  };
};