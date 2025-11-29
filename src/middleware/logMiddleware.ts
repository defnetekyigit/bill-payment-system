import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  const logRequest = {
    time: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    headers: req.headers,
    bodySize: JSON.stringify(req.body)?.length || 0,
  };

  fs.appendFileSync(
    path.join(__dirname, "../../logs/requests.log"),
    JSON.stringify(logRequest) + "\n"
  );

  res.on("finish", () => {
    const latency = Date.now() - start;

    const logResponse = {
      time: new Date().toISOString(),
      statusCode: res.statusCode,
      responseTimeMs: latency,
      responseSize: res.getHeader("Content-Length") || 0,
    };

    fs.appendFileSync(
      path.join(__dirname, "../../logs/responses.log"),
      JSON.stringify(logResponse) + "\n"
    );
  });

  next();
};
