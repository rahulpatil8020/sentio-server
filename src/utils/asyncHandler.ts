import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandlerFn<R extends Request = Request> = (
  req: R,
  res: Response,
  next: NextFunction
) => Promise<any> | void;

export const asyncHandler = <R extends Request = Request>(
  fn: AsyncHandlerFn<R>
): RequestHandler => {
  return (req, res, next) => {
    try {
      const result = fn(req as R, res, next);
      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (err) {
      next(err);
    }
  };
};
