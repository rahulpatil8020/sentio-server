import { Router } from "express";
import * as reminderController from "../controllers/reminder.controller";
import { validateRequest } from "../middleware/validateRequest";
import {
  CreateReminderSchema,
  UpdateReminderSchema,
  InsertManyRemindersSchema,
} from "../schemas/reminder.schema";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Create a single reminder
router.post(
  "/",
  validateRequest(CreateReminderSchema),
  asyncHandler(reminderController.createReminder)
);

// Get all reminders for the user
router.get("/", asyncHandler(reminderController.getReminders));

// Get upcoming reminders for the user
router.get("/upcoming", asyncHandler(reminderController.getUpcomingReminders));

// Update a reminder by ID
router.patch(
  "/:id",
  validateRequest(UpdateReminderSchema),
  asyncHandler(reminderController.updateReminder)
);

// Delete a reminder by ID
router.delete("/:id", asyncHandler(reminderController.deleteReminder));

// Insert many reminders (for AI-generated)
router.post(
  "/bulk-insert",
  validateRequest(InsertManyRemindersSchema),
  asyncHandler(reminderController.insertManyReminders)
);

export default router;
