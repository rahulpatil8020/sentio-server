export interface GeminiHabit {
  title: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  reminderTime?: string;
}

export interface GeminiTodo {
  title: string;
  dueDate?: string; // YYYY-MM-DD
  priority: number;
}

export interface GeminiReminder {
  title: string;
  remindAt: string; // ISO 8601
}

export interface GeminiEmotionalState {
  state: string;
  intensity: number;
  note: string;
}

export interface GeminiUserData {
  habits: GeminiHabit[];
  todos: GeminiTodo[];
  reminders: GeminiReminder[];
  emotionsLast7Days: GeminiEmotionalState[];
}

export interface EmotionalState {
  state:
    | "happy"
    | "joyful"
    | "excited"
    | "relaxed"
    | "calm"
    | "content"
    | "productive"
    | "neutral"
    | "tired"
    | "stressed"
    | "anxious"
    | "overwhelmed"
    | "frustrated"
    | "sad"
    | "depressed"
    | "apathetic"
    | "angry";
  intensity: number; // 1-10
  note: string; // Short reflection in first-person
}

export interface NewHabit {
  title: string;
  description: string; // Why I want this habit
  frequency: "daily" | "weekly" | "monthly";
  reminderTime?: string; // Optional HH:mm
}

export interface NewTodo {
  title: string;
  dueDate?: string; // Optional YYYY-MM-DD
  priority: number; // 1-10
}

export interface NewReminder {
  title: string;
  remindAt: string; // ISO format YYYY-MM-DDTHH:mm:ssZ
}

export interface AnalyzeTranscriptResponse {
  emotionalState: EmotionalState;
  newHabits: NewHabit[];
  completedHabits: string[]; // Exact titles from Habits data
  newTodos: NewTodo[];
  completedTodos: string[]; // Exact titles from Todos data
  newReminders: NewReminder[];
  emergencySuggestion?: string; // Optional, only if necessary
  suggestions: string[]; // First-person actionable suggestions
}
