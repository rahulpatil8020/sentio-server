import { Request, Response } from "express";
import * as habitService from "../services/habit.service";
import { AuthenticatedRequest } from "../types/authRequest.types";
import { IHabit } from "../models/habit.model";

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  const habitData = req.body;
  const habit = await habitService.createHabit(habitData);

  res.status(201).json({
    success: true,
    message: "Habit created successfully",
    data: { habit },
  });
};

export const getHabits = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.userId; // assuming you attach user in auth middleware
  const habits = await habitService.getHabitsByUserId(userId);

  res.status(200).json({
    success: true,
    message: "Habits fetched successfully",
    data: { habits },
  });
};

export const getActiveHabits = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user.userId;
  const habits = await habitService.getActiveHabitsByUserId(userId);

  res.status(200).json({
    success: true,
    message: "Active habits fetched successfully",
    data: { habits },
  });
};

export const updateHabit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const habit = await habitService.updateHabitById(id, req.body);

  res.status(200).json({
    success: true,
    message: "Habit updated successfully",
    data: { habit },
  });
};

export const deleteHabit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const habit = await habitService.deleteHabitById(id);

  res.status(200).json({
    success: true,
    message: "Habit deleted successfully",
    data: { habit },
  });
};

export const markHabitsCompleted = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user.userId;
  const { titles } = req.body; // expects array of habit titles

  await habitService.markHabitsCompleted(userId, titles);

  res.status(200).json({
    success: true,
    message: "Habits marked as completed successfully",
  });
};
