import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth";

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const token = req.headers?.["x-access-token"];
  try {
    const decoded = AuthService.decodeToken(token as string);
    req.decoded = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status?.(401).send({ code: 401, error: error.message });
    } else {
      res.status?.(401).send({ code: 401, error: "Unknown auth error" });
    }
  }
}
