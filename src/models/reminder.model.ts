import mongoose, { Document, Schema, Model } from "mongoose";

// --------------------
// Reminder Interface
// --------------------
export interface IReminder extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  remindAt: Date;
  createdBy: "AI" | "USER";
  createdAt: Date;
}

// --------------------
// Static Methods Interface
// --------------------
interface IReminderModel extends Model<IReminder> {
  findByUserId(userId: string): Promise<IReminder[]>;
  findUpcomingByUserId(userId: string): Promise<IReminder[]>;
  createReminder(data: Partial<IReminder>): Promise<IReminder>;
  insertManyReminders(
    userId: string,
    reminders: { title: string; remindAt: string }[]
  ): Promise<IReminder[]>;
  updateReminderById(
    id: string,
    data: Partial<IReminder>
  ): Promise<IReminder | null>;
  deleteReminderById(id: string): Promise<IReminder | null>;
  findByDate(userId: string, date: string): Promise<IReminder[]>;
}

// --------------------
// Schema Definition
// --------------------
const ReminderSchema: Schema<IReminder> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    remindAt: { type: Date, required: true },
    createdBy: { type: String, enum: ["AI", "USER"], default: "USER" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

// --------------------
// Static Methods
// --------------------
ReminderSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId });
};

ReminderSchema.statics.findUpcomingByUserId = function (userId: string) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // Start of today

  return this.find({
    userId,
    remindAt: { $gte: todayStart },
  }).sort({ remindAt: 1 }); // Soonest first
};

ReminderSchema.statics.createReminder = function (data: Partial<IReminder>) {
  return this.create(data);
};

ReminderSchema.statics.updateReminderById = function (
  id: string,
  data: Partial<IReminder>
) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

ReminderSchema.statics.deleteReminderById = function (id: string) {
  return this.findByIdAndDelete(id);
};

ReminderSchema.statics.insertManyReminders = async function (
  userId: string,
  reminders: { title: string; remindAt: string }[]
) {
  if (!reminders?.length) return [];

  const docs = reminders.map((reminder) => ({
    userId,
    title: reminder.title,
    remindAt: new Date(reminder.remindAt),
    createdBy: "AI",
  }));

  return this.insertMany(docs);
};

ReminderSchema.statics.findByDate = async function (
  userId: string,
  date: string
) {
  const start = new Date(date);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return this.find({
    userId,
    remindAt: {
      $gte: start,
      $lte: end,
    },
  }).sort({ remindAt: 1 });
};

// --------------------
// Model
// --------------------
const Reminder = mongoose.model<IReminder, IReminderModel>(
  "Reminder",
  ReminderSchema
);
export default Reminder;
