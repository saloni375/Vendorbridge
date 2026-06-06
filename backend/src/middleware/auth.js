import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  try {
    const user = jwt.verify(token, env.jwtSecret);
    const userId = user.id || user.userId || user.sub;

    if (!userId) {
      return res.status(401).json({ message: "Authentication token is missing a user id" });
    }

    req.user = { ...user, id: userId };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "You do not have permission to perform this action" });
    }

    return next();
  };
}
