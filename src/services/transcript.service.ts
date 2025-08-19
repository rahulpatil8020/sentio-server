
import mongoose from "mongoose";
import Transcript, { ITranscript } from "../models/transcript.model";
import Habit from "../models/habit.model";
import EmotionalState from "../models/emotionalstate.model";
import Todo from "../models/todo.model";
import Reminder from "../models/reminder.model";
import { analyzeTranscriptWithGemini } from "../utils/gemini/gemini.utils";
import { buildGeminiPrompt } from "../utils/gemini/gemini.prompt";
import { getUserDataForGemini } from "../utils/gemini/gemini.data";
import { NewHabit, NewTodo } from "../types/gemini.types";
import { NotFoundError } from "../utils/errors/errors";

/**
 * Step 1: Create a new transcript entry
 */
export const createTranscriptEntry = async (
  userId: string,
  text: string
): Promise<ITranscript> => {
  const transcript = await Transcript.createTranscript({
    userId: new mongoose.Types.ObjectId(userId),
    text,
    openAiResponse: null,
    summary: "",
  });

  return transcript;
};

/**
 * Step 2: Process an existing transcript with Gemini and update
 */
export const processTranscriptEntry = async (
  userId: string,
  transcriptDoc: ITranscript
) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Fetch related user data
    const [rawHabits, rawEmotions, rawTodos, rawReminders] = await Promise.all([
      Habit.findActiveHabitsByUserId(userId),
      EmotionalState.getLast7DaysByUserId(userObjectId),
      Todo.findIncompleteTodoByUserId(userId),
      Reminder.findUpcomingByUserId(userId),
    ]);

    const { habits, emotionsLast7Days, todos, reminders } = getUserDataForGemini({
      habits: rawHabits,
      emotionalStates: rawEmotions,
      todos: rawTodos,
      reminders: rawReminders,
    });

    // Build prompt & analyze with Gemini
    const systemPrompt = buildGeminiPrompt(
      habits,
      emotionsLast7Days,
      todos,
      reminders,
      transcriptDoc.text
    );

    const data = await analyzeTranscriptWithGemini(systemPrompt);

    // Save emotional state
    if (data.emotionalState) {
      await EmotionalState.createEmotionalState({
        userId: userObjectId,
        ...data.emotionalState,
      });
    }

    // Save new habits
    if (data.newHabits?.length) {
      const habitsToInsert = data.newHabits.map((h: NewHabit) => ({
        ...h,
        frequency: h.frequency as "daily" | "weekly" | "monthly",
      }));
      await Habit.insertManyHabits(userId, habitsToInsert);
    }

    // Mark completed habits
    if (data.completedHabits?.length) {
      await Habit.markHabitsCompleted(userId, data.completedHabits);
    }

    // Save new todos
    if (data.newTodos?.length) {
      const todosToInsert = data.newTodos.map((t: NewTodo) => ({
        title: t.title,
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        priority: t.priority,
      }));
      await Todo.insertManyTodos(userId, todosToInsert);
    }

    // Mark completed todos
    if (data.completedTodos?.length) {
      await Todo.markCompletedTodos(userId, data.completedTodos);
    }

    // Save new reminders
    if (data.newReminders?.length) {
      await Reminder.insertManyReminders(userId, data.newReminders);
    }

    // Update transcript with Gemini response
    transcriptDoc.openAiResponse = data;
    transcriptDoc.summary = data.suggestions?.join(" ") || "";
    await transcriptDoc.save();

    return data;
  } catch (err) {
    console.error("❌ Transcript processing failed:", err);
    return {
      error: "Transcript was saved, but Gemini processing failed.",
    };
  }
};

