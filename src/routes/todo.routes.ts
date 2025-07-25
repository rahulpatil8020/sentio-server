import { Router } from "express";
import * as todoController from "../controllers/todo.controller";
import { validateRequest } from "../middleware/validateRequest";
import {
  CreateTodoSchema,
  UpdateTodoSchema,
  MarkCompletedTodosSchema,
} from "../schemas/todo.schema";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Create a new todo
router.post(
  "/",
  validateRequest(CreateTodoSchema),
  asyncHandler(todoController.createTodo)
);

// Get all todos for a user
router.get("/", asyncHandler(todoController.getTodos));

// Get incomplete todos for a user
router.get("/incomplete", asyncHandler(todoController.getIncompleteTodos));

// Update a todo by ID
router.patch(
  "/:id",
  validateRequest(UpdateTodoSchema),
  asyncHandler(todoController.updateTodo)
);

// Delete a todo by ID
router.delete("/:id", asyncHandler(todoController.deleteTodo));

// Mark multiple todos as completed
router.post(
  "/mark-completed",
  validateRequest(MarkCompletedTodosSchema),
  asyncHandler(todoController.markCompletedTodos)
);

export default router;
