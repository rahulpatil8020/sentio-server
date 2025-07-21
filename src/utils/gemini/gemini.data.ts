import { IHabit } from "../../models/habit.model";
import { ITodo } from "../../models/todo.model";
import { IReminder } from "../../models/reminder.model";
import { IEmotionalState } from "../../models/emotionalstate.model";
import { GeminiHabit } from "../../types/gemini.types";
import { GeminiTodo } from "../../types/gemini.types";
import { GeminiReminder } from "../../types/gemini.types";
import { GeminiEmotionalState } from "../../types/gemini.types";
import { GeminiUserData } from "../../types/gemini.types";

export const getUserDataForGemini = ({
  habits,
  reminders,
  todos,
  emotionalStates,
}: {
  habits: IHabit[];
  reminders: IReminder[];
  todos: ITodo[];
  emotionalStates: IEmotionalState[];
}): GeminiUserData => {
  const formattedHabits = habits.map((h) => ({
    title: h.title,
    description: h.description || "",
    frequency: h.frequency,
    reminderTime: h.reminderTime || undefined,
  }));

  const formattedReminders = reminders.map((r) => ({
    title: r.title,
    remindAt: r.remindAt.toISOString(),
  }));

  const formattedTodos = todos.map((t) => ({
    title: t.title,
    dueDate: t.dueDate ? t.dueDate.toISOString().split("T")[0] : undefined,
    priority: t.priority || 5,
  }));

  const formattedEmotionalStates = emotionalStates.map((es) => ({
    state: es.state,
    intensity: es.intensity,
    note: es.note || "",
  }));

  return {
    habits: formattedHabits,
    reminders: formattedReminders,
    todos: formattedTodos,
    emotionsLast7Days: formattedEmotionalStates, // Already in correct format
  };
};
