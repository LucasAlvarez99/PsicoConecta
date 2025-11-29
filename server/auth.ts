import type { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import { getAuthSecret } from "./utils/jwt";

export interface JWTPayload {
  userId: string;
  role: string;
  [key: string]: any;
}

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const secret = getAuthSecret();
    const payload = jwt.verify(token, secret);
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
