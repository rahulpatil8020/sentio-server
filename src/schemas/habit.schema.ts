import { z } from "zod";

// 🔥 Create Habit Schema
export const CreateHabitSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  startDate: z
    .string()
    .datetime("Start date must be a valid ISO datetime")
    .optional(),
  endDate: z
    .string()
    .datetime("End date must be a valid ISO datetime")
    .optional(),
  frequency: z.enum(["daily", "weekly", "monthly"], {
    required_error: "Frequency is required",
  }),
  reminderTime: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
      message: "Reminder time must be in HH:mm format",
    })
    .optional(),
});

// 🔥 Update Habit Schema (partial because PATCH)
export const UpdateHabitSchema = CreateHabitSchema.partial();

// 🔥 Mark Habits Completed Schema
export const MarkHabitsCompletedSchema = z.object({
  titles: z
    .array(z.string().min(1, "Habit title cannot be empty"))
    .nonempty("At least one habit title must be provided"),
});
