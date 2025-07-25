// src/models/pendingSuggestions.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPendingSuggestions extends Document {
  userId: mongoose.Types.ObjectId;
  habits: {
    title: string;
    description: string;
    frequency: "daily" | "weekly" | "monthly";
    reminderTime?: string;
  }[];
  todos: {
    title: string;
    dueDate?: Date;
  }[];
  reminders: {
    title: string;
    remindAt: Date;
  }[];
  createdAt: Date;
  expiresAt: Date;
}

const PendingSuggestionsSchema = new Schema<IPendingSuggestions>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 🛡 One pending entry per user
    },
    habits: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        frequency: {
          type: String,
          enum: ["daily", "weekly", "monthly"],
          required: true,
        },
        reminderTime: { type: String }, // HH:mm
      },
    ],
    todos: [
      {
        title: { type: String, required: true },
        dueDate: { type: Date },
      },
    ],
    reminders: [
      {
        title: { type: String, required: true },
        remindAt: { type: Date, required: true },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 1000 * 60 * 60 * 24 * 7, // 🔥 auto-expire in 7 days
    },
  },
  { versionKey: false }
);

// TTL index for auto-delete expired entries
PendingSuggestionsSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IPendingSuggestions>(
  "PendingSuggestions",
  PendingSuggestionsSchema
);
