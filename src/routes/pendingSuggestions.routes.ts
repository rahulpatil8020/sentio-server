import express, { Router } from "express";
import {
  getPendingSuggestions,
  commitSuggestions,
  discardSuggestions,
} from "../controllers/pendingSuggestions.controller";
import { verifyToken } from "../middleware/verifyToken";
import { asyncHandler } from "../utils/asyncHandler";

const router: Router = express.Router();

// ✅ Protect all routes with JWT middleware
router.use(verifyToken);

// GET /api/suggestions/pending
router.get("/", asyncHandler(getPendingSuggestions));

// POST /api/suggestions/commit
// router.post("/commit", asyncHandler(commitSuggestions));

// DELETE /api/suggestions/pending
// router.delete("/:id", asyncHandler(discardSuggestions));

export default router;
