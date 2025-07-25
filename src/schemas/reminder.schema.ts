import { z } from "zod";

export const CreateReminderSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "Title cannot be empty"),
  remindAt: z
    .string({
      required_error: "Reminder time is required",
    })
    .datetime("remindAt must be a valid ISO datetime"),
});

export const UpdateReminderSchema = CreateReminderSchema.partial();

export const InsertManyRemindersSchema = z.object({
  reminders: z
    .array(
      z.object({
        title: z.string().min(1, "Title cannot be empty"),
        remindAt: z.string().datetime("remindAt must be a valid ISO datetime"),
      })
    )
    .nonempty("At least one reminder must be provided"),
});
