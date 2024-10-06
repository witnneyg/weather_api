import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import ApiError from "../util/errors/api-error";

const oneMinute = 1 * 60 * 1000;

export const rateLimiterMiddlware = rateLimit({
  windowMs: oneMinute,
  max: 5,
  keyGenerator(req: Request): string {
    return req.ip;
  },
  handler(req, res: Response): void {
    res.status(429).send(
      ApiError.format({
        code: 429,
        message: "Too many requests to the /forecast endpoint",
      })
    );
  },
});
