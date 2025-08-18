import { Router } from "express";
import * as dailyDataController from "../controllers/dailyData.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middleware/verifyToken";
import { validateTimezone } from "../middleware/timezone";

const router = Router();

// Secure all routes with JWT
router.use(verifyToken);
router.use(validateTimezone);
// GET /daily-data?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get("/today", asyncHandler(dailyDataController.getTodaysData))
router.get("/", asyncHandler(dailyDataController.getDailyData));
router.get("/range", asyncHandler(dailyDataController.getDailyDataInRange));

export default router;