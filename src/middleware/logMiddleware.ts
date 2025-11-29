import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  const logDir = path.join(__dirname, "../logs");

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const requestLogPath = path.join(logDir, "requests.log");
  const responseLogPath = path.join(logDir, "responses.log");

  // Request log
  const logRequest = {
    time: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    headers: req.headers,
    bodySize: JSON.stringify(req.body)?.length || 0,
  };

  fs.appendFileSync(requestLogPath, JSON.stringify(logRequest) + "\n");

  // Response log
  res.on("finish", () => {
    const latency = Date.now() - start;

    const logResponse = {
      time: new Date().toISOString(),
      statusCode: res.statusCode,
      responseTimeMs: latency,
      responseSize: res.getHeader("Content-Length") || 0,
    };

    fs.appendFileSync(responseLogPath, JSON.stringify(logResponse) + "\n");
  });

  next();
};
