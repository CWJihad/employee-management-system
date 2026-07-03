import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

// confirm user logged in or not
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = jwt.verify(token, JWT_SECRET);
    req.session = session;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

};

// confirm user admin or not
const adminMiddleware = (req, res, next) => {

    if (req?.session?.role !== "ADMIN") {

        return res.status(403).json({
            error: "Admin access required!"
        })
        
    }

    next()

}

export {
    authMiddleware,
    adminMiddleware
}
