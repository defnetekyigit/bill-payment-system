import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
