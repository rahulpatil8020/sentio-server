import { NextFunction, Response } from "express";
import { AuthRequest } from "./verifyToken";

const activeRequests = new Map<string, boolean>();

export const lockPerUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return; // ✅ explicitly end
  }

  if (activeRequests.get(userId)) {
    res.status(429).json({
      message: "A transcript is already being processed. Please wait.",
    });
    return; // ✅ explicitly end
  }

  // Lock this user
  activeRequests.set(userId, true);

  // When response finishes, release the lock
  res.on("finish", () => {
    activeRequests.delete(userId);
  });

  next();
};
