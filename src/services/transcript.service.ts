// import { analyzeTranscriptWithGemini } from "../utils/gemini/gemini.utils";
// import Habit from "../models/habit.model";
// import EmotionalState from "../models/emotionalstate.model";
// import Todo from "../models/todo.model";
// import Reminder from "../models/reminder.model";
// import Transcript from "../models/transcript.model";
// import { getUserDataForGemini } from "../utils/gemini/gemini.data";
// import { buildGeminiPrompt } from "../utils/gemini/gemini.prompt";
// import mongoose from "mongoose";
// import { NewHabit, NewTodo } from "../types/gemini.types";
// import { NotFoundError } from "../utils/errors/errors";
// import { ITranscript } from "../models/transcript.model";


// export const processTranscriptService = async (
//   userId: string,
//   transcript: string
// ) => {
//   // ✅ Fetch user data
//   const [rawHabits, rawEmotions, rawTodos, rawReminders] = await Promise.all([
//     Habit.findActiveHabitsByUserId(userId),
//     EmotionalState.getLast7DaysByUserId(new mongoose.Types.ObjectId(userId)),
//     Todo.findIncompleteTodoByUserId(userId),
//     Reminder.findUpcomingByUserId(userId),
//   ]);

//   // ✅ Transform the user data for Gemini
//   const { habits, emotionsLast7Days, todos, reminders } = getUserDataForGemini({
//     habits: rawHabits,
//     emotionalStates: rawEmotions,
//     todos: rawTodos,
//     reminders: rawReminders,
//   });

//   // ✅ Build prompt using reusable utility
//   const systemPrompt = buildGeminiPrompt(
//     habits,
//     emotionsLast7Days,
//     todos,
//     reminders,
//     transcript
//   );

//   // ✅ Call Gemini
//   const data = await analyzeTranscriptWithGemini(systemPrompt);

//   //data = {
//   //     "emotionalState": {
//   //         "state": "productive",
//   //         "intensity": 9,
//   //         "note": "I feel productive and a strong sense of accomplishment today because I took intentional small steps, like meditating, taking a mindful lunch break, going for a walk, and using strategies to avoid distractions. I'm proud of the progress I made on my report and trying a new recipe, and I feel a sense of clarity and being 'anchored' by reflecting on my day."
//   //     },
//   //     "newHabits": [
//   //         {
//   //             "title": "Limit phone scrolling",
//   //             "description": "I want to intentionally limit my phone scrolling, especially during breaks and before bed, to reduce distractions and be more present.",
//   //             "frequency": "daily"
//   //         },
//   //         {
//   //             "title": "Take mindful lunch break",
//   //             "description": "I want to consistently take my lunch break away from my desk, slowing down to actually taste my food and recharge.",
//   //             "frequency": "daily"
//   //         },
//   //         {
//   //             "title": "Go for a short walk",
//   //             "description": "I want to incorporate short walks into my day when my focus slips to recharge and get some fresh air.",
//   //             "frequency": "daily"
//   //         },
//   //         {
//   //             "title": "Wash dishes immediately",
//   //             "description": "I want to wash dishes right after meals to keep my space tidy and reduce accumulating chores.",
//   //             "frequency": "daily"
//   //         }
//   //     ],
//   //     "completedHabits": [
//   //         "Meditate after waking up",
//   //         "Try a new recipe",
//   //         "Do short yoga before bed"
//   //     ],
//   //     "newTodos": [
//   //         {
//   //             "title": "Outline next phase of project",
//   //             "priority": 8
//   //         },
//   //         {
//   //             "title": "Brainstorm new recipe for weekend",
//   //             "dueDate": "2025-07-27",
//   //             "priority": 6
//   //         }
//   //     ],
//   //     "completedTodos": [
//   //         "Move rosemary plant for more light",
//   //         "Work on looming project report draft"
//   //     ],
//   //     "newReminders": [
//   //         {
//   //             "title": "Water plants first thing",
//   //             "remindAt": "2025-07-22T15:00:00Z"
//   //         }
//   //     ],
//   //     "suggestions": [
//   //         "I should continue to use strategies like putting my phone in another room or clearing my desk to support my focus and reduce distractions.",
//   //         "I could reflect on what made today's mindful lunch and walks so effective and plan how to integrate them into my routine more consistently.",
//   //         "I should remember the 'every action is a vote' concept from Atomic Habits and use it to guide my choices throughout the day, especially regarding screen time.",
//   //         "I could review my progress at the end of each day to reinforce the 'small steps forward' feeling that resonated with me today."
//   //     ]
//   // }

//   // // ✅ Save emotional state
//   if (data.emotionalState) {
//     await EmotionalState.createEmotionalState({
//       userId: new mongoose.Types.ObjectId(userId),
//       ...data.emotionalState,
//     });
//   }

//   // ✅ Save new habits, todos, reminders
//   if (data.newHabits?.length) {
//     const habitsToInsert = data.newHabits.map((h: NewHabit) => ({
//       ...h,
//       frequency: h.frequency as "daily" | "weekly" | "monthly",
//     }));
//     await Habit.insertManyHabits(userId, habitsToInsert);
//   }

//   if (data.completedHabits?.length) {
//     await Habit.markHabitsCompleted(userId, data.completedHabits);
//   }

//   if (data.newTodos?.length) {
//     const todosToInsert = data.newTodos.map((t: NewTodo) => ({
//       title: t.title,
//       dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
//       priority: t.priority,
//     }));

//     await Todo.insertManyTodos(userId, todosToInsert);
//   }

//   if (data.completedTodos?.length) {
//     const updatedCount = await Todo.markCompletedTodos(
//       userId,
//       data.completedTodos
//     );
//     console.log(`✅ Marked ${updatedCount} todos as completed.`);
//   }

//   if (data.newReminders?.length) {
//     await Reminder.insertManyReminders(userId, data.newReminders);
//   }

//   // ✅ Save transcript and Gemini response
//   await Transcript.createTranscript({
//     userId: new mongoose.Types.ObjectId(userId),
//     text: transcript,
//     openAiResponse: data,
//     summary: data.suggestions?.join(" ") || "", // Optional summary field
//   });

//   return data; // Send dashboard data back to controller
// };

// function cleanGeminiResponse(raw: string): string {
//   return raw
//     .replace(/```json|```/g, "") // Remove ```json and ```
//     .trim(); // Trim whitespace and newlines
// }

// export const getSummaryByDate = async (
//   userId: string,
//   date: string
// ): Promise<Pick<ITranscript, "summary" | "createdAt"> | null> => {
//   const summary = await Transcript.getSummaryByDate(userId, date);

//   if (!summary) {
//     throw new NotFoundError("Transcript summary for this date");
//   }

//   return summary;
// };


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

/**
 * Get transcript summary for a specific date
 */
export const getSummaryByDate = async (
  userId: string,
  date: string
): Promise<Pick<ITranscript, "summary" | "createdAt"> | null> => {
  const summary = await Transcript.getSummaryByDate(userId, date);

  if (!summary) {
    throw new NotFoundError("Transcript summary for this date");
  }

  return summary;
};

export const getSummariesByDate = async (
  userId: string,
  date: string
): Promise<Pick<ITranscript, "summary" | "createdAt">[]> => {
  return Transcript.getSummariesByDate(userId, date);
};

export const getTranscriptsByDate = async (
  userId: string,
  date: string
): Promise<ITranscript[]> => {
  return Transcript.getTranscriptsByDate(userId, date);
};

export const getSummariesByRange = async (
  userId: string,
  start: Date,
  end: Date
): Promise<Pick<ITranscript, "summary" | "createdAt">[]> => {
  return Transcript.getSummariesByRange(userId, start, end);
};

export const getTranscriptsByRange = async (
  userId: string,
  start: Date,
  end: Date
): Promise<ITranscript[]> => {
  return Transcript.getTranscriptsByRange(userId, start, end);
};