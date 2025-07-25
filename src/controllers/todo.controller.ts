import { Response } from "express";
import { AuthenticatedRequest } from "../types/authRequest.types";
import * as todoService from "../services/todo.service";

export const createTodo = async (req: AuthenticatedRequest, res: Response) => {
  const todo = await todoService.createTodo(req.user!.userId, req.body);

  res.status(201).json({
    success: true,
    message: "Todo created successfully",
    data: { todo },
  });
};

export const getTodos = async (req: AuthenticatedRequest, res: Response) => {
  const todos = await todoService.getTodosByUserId(req.user!.userId);

  res.status(200).json({
    success: true,
    message: "Todos fetched successfully",
    data: { todos },
  });
};

export const getIncompleteTodos = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const todos = await todoService.getIncompleteTodosByUserId(req.user!.userId);

  res.status(200).json({
    success: true,
    message: "Incomplete todos fetched successfully",
    data: { todos },
  });
};

export const updateTodo = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const todo = await todoService.updateTodoById(id, req.body);

  res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    data: { todo },
  });
};

export const deleteTodo = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const todo = await todoService.deleteTodoById(id);

  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    data: { todo },
  });
};

export const markCompletedTodos = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const updatedCount = await todoService.markCompletedTodos(
    req.user!.userId,
    req.body.titles
  );

  res.status(200).json({
    success: true,
    message: `${updatedCount} todos marked as completed`,
  });
};
