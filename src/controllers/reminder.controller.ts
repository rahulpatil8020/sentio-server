import { Response } from "express";
import { AuthenticatedRequest } from "../types/authRequest.types";
import * as reminderService from "../services/reminder.service";

export const createReminder = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const reminder = await reminderService.createReminder(
    req.user!.userId,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Reminder created successfully",
    data: { reminder },
  });
};

export const getReminders = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const reminders = await reminderService.getRemindersByUserId(
    req.user!.userId
  );

  res.status(200).json({
    success: true,
    message: "Reminders fetched successfully",
    data: { reminders },
  });
};

export const getUpcomingReminders = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const reminders = await reminderService.getUpcomingRemindersByUserId(
    req.user!.userId
  );

  res.status(200).json({
    success: true,
    message: "Upcoming reminders fetched successfully",
    data: { reminders },
  });
};

export const updateReminder = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const reminder = await reminderService.updateReminderById(id, req.body);

  res.status(200).json({
    success: true,
    message: "Reminder updated successfully",
    data: { reminder },
  });
};

export const deleteReminder = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const reminder = await reminderService.deleteReminderById(id);

  res.status(200).json({
    success: true,
    message: "Reminder deleted successfully",
    data: { reminder },
  });
};

export const insertManyReminders = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const reminders = await reminderService.insertManyReminders(
    req.user!.userId,
    req.body.reminders
  );

  res.status(201).json({
    success: true,
    message: "Reminders inserted successfully",
    data: { reminders },
  });
};
