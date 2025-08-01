import Habit, { IHabit } from "../models/habit.model";
import { HabitError } from "../utils/errors/errors";

export const createHabit = async (data: Partial<IHabit>): Promise<IHabit> => {
  return Habit.createHabit(data);
};

export const getHabitsByUserId = async (userId: string): Promise<IHabit[]> => {
  return Habit.findHabitsByUserId(userId);
};

export const getActiveHabitsByUserId = async (
  userId: string
): Promise<IHabit[]> => {
  return Habit.findActiveHabitsByUserId(userId);
};

export const updateHabitById = async (
  id: string,
  data: Partial<IHabit>
): Promise<IHabit | null> => {
  const updatedHabit = await Habit.updateHabitById(id, data);
  if (!updatedHabit) throw new HabitError("Habit not found");
  return updatedHabit;
};

export const acceptHabitById = async (id: string): Promise<IHabit | null> => {
  const acceptedHabit = await Habit.acceptHabitById(id);
  if (!acceptedHabit) throw new HabitError("Habit not found");
  return acceptedHabit;
}

export const deleteHabitById = async (id: string): Promise<IHabit | null> => {
  const deletedHabit = await Habit.deleteHabitById(id);
  if (!deletedHabit) throw new HabitError("Habit not found");
  return deletedHabit;
};

export const markHabitsCompleted = async (
  userId: string,
  titles: string[]
): Promise<void> => {
  if (!titles || titles.length === 0) {
    throw new HabitError("No habit titles provided");
  }
  await Habit.markHabitsCompleted(userId, titles);
};
