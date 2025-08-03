import mongoose from "mongoose";
import Reminder, { IReminder } from "../models/reminder.model";
import { ReminderError } from "../utils/errors/errors";

export const createReminder = async (
  userId: string,
  data: Partial<IReminder>
): Promise<IReminder> => {
  return Reminder.createReminder({
    ...data,
    userId: new mongoose.Types.ObjectId(userId),
  });
};

export const getRemindersByUserId = async (
  userId: string
): Promise<IReminder[]> => {
  return Reminder.findByUserId(userId);
};


export const getUpcomingRemindersByUserId = async (
  userId: string
): Promise<IReminder[]> => {
  return Reminder.findUpcomingByUserId(userId);
};

export const updateReminderById = async (
  id: string,
  data: Partial<IReminder>
): Promise<IReminder | null> => {
  const updatedReminder = await Reminder.updateReminderById(id, data);
  if (!updatedReminder) throw new ReminderError("Reminder not found");
  return updatedReminder;
};

export const deleteReminderById = async (
  id: string
): Promise<IReminder | null> => {
  const deletedReminder = await Reminder.deleteReminderById(id);
  if (!deletedReminder) throw new ReminderError("Reminder not found");
  return deletedReminder;
};

export const insertManyReminders = async (
  userId: string,
  reminders: { title: string; remindAt: string }[]
): Promise<IReminder[]> => {
  if (!reminders?.length) {
    throw new ReminderError("No reminders provided for bulk insert");
  }
  return Reminder.insertManyReminders(userId, reminders);
};

export const getRemindersByDate = async (
  userId: string,
  date: string
): Promise<IReminder[]> => {
  return Reminder.findByDate(userId, date);
};

export const getRemindersByRange = async (
  userId: string,
  start: Date,
  end: Date
): Promise<IReminder[]> => {
  return Reminder.findByRange(userId, start, end);
};