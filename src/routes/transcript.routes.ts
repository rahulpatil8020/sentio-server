import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { TranscriptSchema } from "../schemas/transcript.schema";
import { processTranscript } from "../controllers/transcript.controller";
import { verifyToken } from "../middleware/verifyToken";
import { lockPerUser } from "../middleware/lockPerUser";
const router = Router();

router.use(verifyToken);

router.post(
  "/",
  lockPerUser,
  validateRequest(TranscriptSchema),
  asyncHandler(processTranscript)
);
router.get(
  "/:transcriptId",
  asyncHandler(async (req, res) => {})
);

router.put(
  "/:transcriptId",
  validateRequest(TranscriptSchema),
  asyncHandler(async (req, res) => {})
);

router.delete(
  "/:transcriptId",
  asyncHandler(async (req, res) => {})
);

export default router;
