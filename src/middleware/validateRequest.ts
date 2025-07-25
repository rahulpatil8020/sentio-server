import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../utils/errors/errors";

export const validateRequest = (schema: ZodSchema<any>) => {
  console.log("Validating request:");
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const rawErrors = result.error.flatten().fieldErrors;

      const formattedErrors: Record<string, string[]> = Object.fromEntries(
        Object.entries(rawErrors).map(([key, value]) => [key, value ?? []])
      );

      return next(new ValidationError(formattedErrors));
    }

    req.body = result.data;
    next();
  };
};
