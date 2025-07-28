import { Router } from "express";
import authRoutes from "./auth.routes";
import transcriptRoutes from "./transcript.routes";
import pendingSuggestionsRoutes from "./pendingSuggestions.routes";
import userRoutes from "./user.routes";
import dailyDataRoutes from "./dailyData.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/transcript", transcriptRoutes);
router.use("/pending-suggestions", pendingSuggestionsRoutes);
router.use("/user", userRoutes);
router.use("/daily-data", dailyDataRoutes);

export default router;
