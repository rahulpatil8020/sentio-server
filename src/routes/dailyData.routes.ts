import { Router } from "express";
import * as dailyDataController from "../controllers/dailyData.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// Secure all routes with JWT
router.use(verifyToken);

// GET /daily-data?date=YYYY-MM-DD
router.get("/", asyncHandler(dailyDataController.getDailyData));

// Optional: for prefetching range of days
// GET /daily-data/range?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get("/range", asyncHandler(dailyDataController.getDailyDataRange));

export default router;