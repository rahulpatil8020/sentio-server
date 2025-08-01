import { Router } from "express";
import * as habitController from "../controllers/habit.controller";
import { validateRequest } from "../middleware/validateRequest";
import { CreateHabitSchema, UpdateHabitSchema } from "../schemas/habit.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);

router.post(
  "/",
  validateRequest(CreateHabitSchema),
  asyncHandler(habitController.createHabit)
);

router.get("/", asyncHandler(habitController.getHabits));

router.get("/active", asyncHandler(habitController.getActiveHabits));

router.patch(
  "/:id",
  validateRequest(UpdateHabitSchema),
  asyncHandler(habitController.updateHabit)
);

router.delete("/:id", asyncHandler(habitController.deleteHabit));

router.post(
  "/mark-completed",
  asyncHandler(habitController.markHabitsCompleted)
);

router.post("/decline", () => { });
router.post("/accept", asyncHandler(habitController.acceptHabit));

export default router;
