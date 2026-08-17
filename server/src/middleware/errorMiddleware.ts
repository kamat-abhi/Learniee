import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

export function notFound(
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  _next,
): void => {
  console.error(err);
  const statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : 500;

  res.status(statusCode).json({
    message: err instanceof Error ? err.message : 'Something went wrong on the server.',
  });
};
