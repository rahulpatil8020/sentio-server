import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errors/apiError";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error("❌ Error:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        type: err.type,
        message: err.message,
        details: err.details || null,
      },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        type: "ValidationError",
        message: "Input validation failed",
        details: err.flatten().fieldErrors,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      type: "InternalServerError",
      message: "Something went wrong",
    },
  });
};
