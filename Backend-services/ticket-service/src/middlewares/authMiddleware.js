import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token requis",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Token invalide",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Map userId from token to id in req.user
    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      ...decoded
    };
    
    next();
  } catch (error) {
    console.error("authMiddleware error:", error);
    return res.status(401).json({
      message: "Token invalide ou expire",
    });
  }
};
