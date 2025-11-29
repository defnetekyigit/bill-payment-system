import { Request, Response, NextFunction } from "express";

const rateLimitStore: Record<string, { count: number; date: string }> = {};

export const rateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const subscriber_no = req.query.subscriber_no as string;

  if (!subscriber_no) {
    return res.status(400).json({ error: "subscriber_no is required" });
  }

  const today = new Date().toISOString().split("T")[0];

  if (!rateLimitStore[subscriber_no]) {
    rateLimitStore[subscriber_no] = { count: 1, date: today };
    return next();
  }

  const record = rateLimitStore[subscriber_no];

  if (record.date !== today) {
    rateLimitStore[subscriber_no] = { count: 1, date: today };
    return next();
  }

  if (record.count >= 3) {
    return res.status(429).json({
      error: "Daily limit reached (3 per day)",
    });
  }

  record.count++;
  next();
};
