import type { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const auth = (req.headers.authorization || "").toString();
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const secret = process.env.WS_JWT_SECRET || process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret);
    (req as any).user = payload; // attach payload to req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
