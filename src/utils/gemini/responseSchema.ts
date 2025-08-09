export const getGeminiResponseSchema = () => {
  return {
    emotionalState: {
      state: "happy | joyful | excited | relaxed | calm | content | productive | neutral | tired | stressed | anxious | overwhelmed | frustrated | sad | depressed | apathetic | angry",
      intensity: "number (1–10)",
      note: "string (short first-person reflection explaining why I feel this way)"
    },
    newHabits: [
      {
        title: "string",
        description: "string (why I want this habit)",
        frequency: "daily | weekly | monthly",
        reminderTime: "HH:mm (optional, local time)"
      }
    ],
    completedHabits: [
      "string (exact title from Habits data)"
    ],
    newTodos: [
      {
        title: "string",
        dueDate: "YYYY-MM-DD (optional, local day)",
        priority: "number (1–10)"
      }
    ],
    completedTodos: [
      "string (exact title from Todos data)"
    ],
    newReminders: [
      {
        title: "string",
        remindAt: "YYYY-MM-DDTHH:mm:ssZ (UTC)"
      }
    ],
    emergencySuggestion: "string (only if necessary)",
    suggestions: [
      "string (first-person actionable suggestion)"
    ]
  };
};