import { Request, Response } from "express";
import PendingSuggestions from "../models/pendingSuggestions.model";
import Habit from "../models/habit.model";
import Todo from "../models/todo.model";
import Reminder from "../models/reminder.model";
import { AuthenticatedRequest } from "../types/authRequest.types";

// Define accepted suggestions payload shape
interface CommitSuggestionsBody {
  habits?: {
    title: string;
    description: string;
    frequency: "daily" | "weekly" | "monthly";
    reminderTime?: string;
  }[];
  todos?: {
    title: string;
    dueDate?: string;
  }[];
  reminders?: {
    title: string;
    remindAt: string; // ISO 8601 date-time string
  }[];
}

// Get pending suggestions for user
export const getPendingSuggestions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const suggestions = await PendingSuggestions.findOne({ userId });
  if (!suggestions) {
    return res.status(404).json({ message: "No pending suggestions found." });
  }

  return res.json(suggestions);
};

// Commit accepted suggestions
export const commitSuggestions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { habits, todos, reminders } = req.body as CommitSuggestionsBody;

  // Save accepted habits
  if (habits?.length) {
    await Habit.insertMany(habits.map((h) => ({ userId, ...h })));
  }

  // Save accepted todos
  if (todos?.length) {
    await Todo.insertMany(
      todos.map((t) => ({
        userId,
        title: t.title,
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
      }))
    );
  }

  // Save accepted reminders
  if (reminders?.length) {
    await Reminder.insertMany(
      reminders.map((r) => ({
        userId,
        title: r.title,
        remindAt: new Date(r.remindAt),
      }))
    );
  }

  // Remove pending suggestions
  await PendingSuggestions.deleteOne({ userId });

  return res.json({ message: "Suggestions committed successfully." });
};

// Discard pending suggestions
export const discardSuggestions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await PendingSuggestions.deleteOne({ userId });
  return res.json({ message: "Pending suggestions discarded." });
};
