import type { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: Error & { status?: number; statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? "Internal server error";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${status} — ${message}`);
    if (err.stack) console.error(err.stack);
  }

  res.status(status).json({ success: false, message });
}

export function notFoundMiddleware(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: "Route not found" });
}
