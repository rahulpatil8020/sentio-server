// EmotionalState.ts
class EmotionalState {
  state: string; // e.g., "happy", "sad", etc.
  intensity: number; // 1-10 scale
  note: string; // a short reflection

  constructor(state: string, intensity: number, note: string) {
    this.state = state;
    this.intensity = intensity;
    this.note = note;
  }
}

// Habit.ts
class Habit {
  title: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  reminderTime?: string; // "HH:mm" format or undefined

  constructor(
    title: string,
    description: string,
    frequency: "daily" | "weekly" | "monthly",
    reminderTime?: string
  ) {
    this.title = title;
    this.description = description;
    this.frequency = frequency;
    this.reminderTime = reminderTime;
  }
}

// Todo.ts
class Todo {
  title: string;
  dueDate: string; // Format: "YYYY-MM-DD"

  constructor(title: string, dueDate: string) {
    this.title = title;
    this.dueDate = dueDate;
  }
}

// Reminder.ts
class Reminder {
  title: string;
  remindAt: string; // Format: "YYYY-MM-DDTHH:mm:ssZ"

  constructor(title: string, remindAt: string) {
    this.title = title;
    this.remindAt = remindAt;
  }
}

export class LifeAssistantResponse {
  emotionalState: EmotionalState;
  newHabits: Habit[];
  completedHabits: string[];
  newTodos: Todo[];
  completedTodos: string[];
  newReminders: Reminder[];
  suggestions: string[];

  constructor(
    emotionalState: EmotionalState,
    newHabits: Habit[],
    completedHabits: string[],
    newTodos: Todo[],
    completedTodos: string[],
    newReminders: Reminder[],
    suggestions: string[]
  ) {
    this.emotionalState = emotionalState;
    this.newHabits = newHabits;
    this.completedHabits = completedHabits;
    this.newTodos = newTodos;
    this.completedTodos = completedTodos;
    this.newReminders = newReminders;
    this.suggestions = suggestions;
  }
}
