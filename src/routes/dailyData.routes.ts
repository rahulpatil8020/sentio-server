import { Router } from "express";
import * as dailyDataController from "../controllers/dailyData.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middleware/verifyToken";
import { validateTimezone } from "../middleware/timezone";

const router = Router();

router.use(verifyToken);
router.use(validateTimezone);

// GET /api/daily-data/today?day=YYYY-MM-DD
router.get("/today", asyncHandler(dailyDataController.getTodaysData))
router.get("/past", asyncHandler(dailyDataController.getDailyData));

export default router;