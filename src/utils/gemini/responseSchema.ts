export const getGeminiResponseSchema = () => {
  return {
    type: "object",
    properties: {
      emotionalState: {
        type: "object",
        properties: {
          state: {
            type: "string",
            enum: [
              "happy",
              "sad",
              "stressed",
              "anxious",
              "excited",
              "relaxed",
              "productive",
              "depressed",
              "overwhelmed",
            ],
          },
          intensity: {
            type: "integer",
            minimum: 1,
            maximum: 10,
          },
          note: {
            type: "string",
          },
        },
        required: ["state", "intensity", "note"],
      },
      newHabits: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            frequency: {
              type: "string",
              enum: ["daily", "weekly", "monthly"],
            },
            reminderTime: {
              type: "string",
              pattern: "^([0-1][0-9]|2[0-3]):[0-5][0-9]$",
            },
          },
          required: ["title", "description", "frequency"],
        },
      },
      completedHabits: {
        type: "array",
        items: { type: "string" },
      },
      newTodos: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            dueDate: {
              type: "string",
              pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            },
          },
          required: ["title"],
        },
      },
      completedTodos: {
        type: "array",
        items: { type: "string" },
      },
      newReminders: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            remindAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["title", "remindAt"],
        },
      },
      emergencySuggestion: {
        type: "string",
      },
      suggestions: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: [
      "emotionalState",
      "newHabits",
      "completedHabits",
      "newTodos",
      "completedTodos",
      "newReminders",
      "suggestions",
    ],
  };
};
