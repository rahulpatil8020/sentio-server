import { z } from "zod";

export const CreateTodoSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "Title cannot be empty"),
  dueDate: z
    .string()
    .datetime("Due date must be a valid ISO datetime")
    .optional(),
  priority: z
    .number()
    .int()
    .min(1, "Priority must be between 1 and 10")
    .max(10, "Priority must be between 1 and 10")
    .default(5),
});

export const UpdateTodoSchema = CreateTodoSchema.partial();

export const MarkCompletedTodosSchema = z.object({
  titles: z
    .array(z.string().min(1, "Todo title cannot be empty"))
    .nonempty("At least one todo title must be provided"),
});
