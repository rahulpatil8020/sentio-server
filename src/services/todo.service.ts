import mongoose from "mongoose";
import Todo, { ITodo } from "../models/todo.model";
import { TodoError } from "../utils/errors/errors";

export const createTodo = async (
  userId: string,
  data: Partial<ITodo>
): Promise<ITodo> => {
  return Todo.createTodo({
    ...data,
    userId: new mongoose.Types.ObjectId(userId),
  });
};

export const getTodosByUserId = async (userId: string): Promise<ITodo[]> => {
  return Todo.findByUserId(userId);
};

export const getIncompleteTodosByUserId = async (
  userId: string
): Promise<ITodo[]> => {
  return Todo.findIncompleteTodoByUserId(userId);
};

export const updateTodoById = async (
  id: string,
  data: Partial<ITodo>
): Promise<ITodo | null> => {
  const updatedTodo = await Todo.updateTodoById(id, data);
  if (!updatedTodo) throw new TodoError("Todo not found");
  return updatedTodo;
};

export const deleteTodoById = async (id: string): Promise<ITodo | null> => {
  const deletedTodo = await Todo.deleteTodoById(id);
  if (!deletedTodo) throw new TodoError("Todo not found");
  return deletedTodo;
};

export const markCompletedTodos = async (
  userId: string,
  titles: string[]
): Promise<number> => {
  if (!titles?.length) throw new TodoError("No todo titles provided");
  return Todo.markCompletedTodos(userId, titles);
};
