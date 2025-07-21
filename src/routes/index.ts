import { Router } from "express";
import authRoutes from "./auth.routes";
import transcriptRoutes from "./transcript.routes";
import pendingSuggestionsRoutes from "./pendingSuggestions.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/transcript", transcriptRoutes);
router.use("/pending-suggestions", pendingSuggestionsRoutes);

export default router;
