import mongoose, { Document, Schema, Model } from "mongoose";
import { toUtcBoundsForLocalRange } from "../utils/time";

// 🔥 Subdocument for completions
const CompletionSchema = new Schema(
  {
    date: {
      type: Date,
      required: true, // exact completion timestamp
    },
  },
  { _id: false }
);

// 🔥 Interfaces
export interface ICompletion {
  date: Date;
  completedAt?: Date;
}

export interface IStreak {
  current: number;
  longest: number;
  lastCompletedDate?: Date;
}

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
  startDate: Date;
  endDate?: Date;
  frequency: "daily" | "weekly" | "monthly";
  reminderTime?: string; // e.g., "08:00"
  streak: IStreak;
  completions: ICompletion[];
  isDeleted: boolean;
  isAccepted: boolean;

}

interface IHabitModel extends Model<IHabit> {
  findHabitsByUserId(userId: string): Promise<IHabit[]>;
  findActiveHabitsByUserId(userId: string): Promise<IHabit[]>;
  createHabit(data: Partial<IHabit>): Promise<IHabit>;
  updateHabitById(id: string, data: Partial<IHabit>): Promise<IHabit | null>;
  deleteHabitById(id: string): Promise<IHabit | null>;
  insertManyHabits(
    userId: string,
    habits: Partial<IHabit>[]
  ): Promise<IHabit | null>;
  markHabitsCompleted(userId: string, titles: string[]): Promise<void> | null;
  acceptHabitById(id: string): Promise<IHabit | null>;
  findByRangeGrouped(userId: string, start: string, end: string, timezone?: string): Promise<any>;
}

// 🔥 Main Habit Schema
const HabitSchema: Schema<IHabit> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    reminderTime: String, // "HH:mm"
    streak: {
      current: {
        type: Number,
        default: 0,
      },
      longest: {
        type: Number,
        default: 0,
      },
      lastCompletedDate: Date,
    },
    completions: [CompletionSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

// 🔥 Static Methods
HabitSchema.statics.findHabitsByUserId = function (userId: string) {
  return this.find({ userId });
};

HabitSchema.statics.findActiveHabitsByUserId = function (userId: string) {
  return this.find({
    userId,
    isDeleted: false,
  });
};

HabitSchema.statics.acceptHabitById = function (id: string) {
  return this.findByIdAndUpdate(id, { isAccepted: true }, { new: true });
}

HabitSchema.statics.createHabit = function (data: Partial<IHabit>) {
  return this.create(data);
};

HabitSchema.statics.updateHabitById = function (
  id: string,
  data: Partial<IHabit>
) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

HabitSchema.statics.deleteHabitById = function (id: string) {
  return this.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

HabitSchema.statics.insertManyHabits = function (
  userId: string,
  habits: Partial<IHabit>[]
) {
  const data = habits.map((h) => ({
    userId,
    ...h,
  }));
  return this.insertMany(data);
};

HabitSchema.statics.markHabitsCompleted = async function (
  userId: string,
  titles: string[]
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  const habits = await this.find({
    userId,
    title: { $in: titles },
    isDeleted: false,
  });

  for (const habit of habits) {
    const alreadyCompleted = habit.completions.some(
      (c: any) => c.date.toDateString() === today.toDateString()
    );

    if (!alreadyCompleted) {
      habit.completions.push({ date: today });

      // 🔥 Update streaks
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const lastDate = habit.streak.lastCompletedDate
        ? new Date(habit.streak.lastCompletedDate)
        : null;

      if (lastDate && lastDate.toDateString() === yesterday.toDateString()) {
        habit.streak.current += 1;
      } else {
        habit.streak.current = 1;
      }

      if (habit.streak.current > habit.streak.longest) {
        habit.streak.longest = habit.streak.current;
      }

      habit.streak.lastCompletedDate = today;

      await habit.save();
    }
  }
};

HabitSchema.statics.findByRangeGrouped = function (
  userId: string,
  start: string,
  end: string,
  timezone: string = "UTC"
) {
  const { startUTC, endUTC } = toUtcBoundsForLocalRange(start, end, timezone);
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), isDeleted: false } },
    { $unwind: "$completions" },
    { $match: { "completions.date": { $gte: startUTC, $lte: endUTC } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$completions.date", timezone: timezone } },
        habits: {
          $push: {
            _id: "$_id",
            title: "$title",
            description: "$description",
            frequency: "$frequency",
            streak: "$streak",
            completion: "$completions",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const Habit = mongoose.model<IHabit, IHabitModel>("Habit", HabitSchema);
export default Habit;
