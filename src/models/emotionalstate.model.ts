import mongoose, { Document, Schema, Model } from "mongoose";
import { toUtcBoundsForLocalRange } from "../utils/time";

// --------------------
// EmotionalState Interface
// --------------------
export interface IEmotionalState extends Document {
  userId: mongoose.Types.ObjectId | string;
  state: string; // e.g., "happy", "stressed"
  intensity: number; // 1–10 scale
  note?: string;
  createdAt: Date;
}

// --------------------
// Static Methods Interface
// --------------------
interface IEmotionalStateModel extends Model<IEmotionalState> {
  findByUser(userId: mongoose.Types.ObjectId): Promise<IEmotionalState[]>;
  createEmotionalState(
    data: Partial<IEmotionalState>
  ): Promise<IEmotionalState>;
  deleteById(id: string): Promise<IEmotionalState | null>;
  getLast7DaysByUserId(userId: mongoose.Types.ObjectId): Promise<IEmotionalState[]>;
  getByDate(userId: mongoose.Types.ObjectId, date: string): Promise<IEmotionalState[]>;
  findByRange(userId: string, start: Date, end: Date): Promise<IEmotionalState[]>
  findByRangeGrouped(userId: string, start: string, end: string, timezone?: string): Promise<any>
}

// --------------------
// Schema Definition
// --------------------
const EmotionalStateSchema: Schema<IEmotionalState> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    state: { type: String, required: true },
    intensity: { type: Number, min: 1, max: 10, required: true },
    note: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

// --------------------
// Static Methods
// --------------------
EmotionalStateSchema.statics.findByUser = function (userId: string) {
  return this.find({ userId });
};

EmotionalStateSchema.statics.createEmotionalState = function (
  data: Partial<IEmotionalState>
) {
  return this.create(data);
};

EmotionalStateSchema.statics.deleteById = function (id: string) {
  return this.findByIdAndDelete(id);
};

EmotionalStateSchema.statics.getLast7DaysByUserId = function (userId: string) {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6); // includes today

  return this.find({
    userId,
    createdAt: {
      $gte: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)), // start of 7 days ago
      $lte: new Date(today.setHours(23, 59, 59, 999)), // end of today
    },
  }).sort({ createdAt: -1 }); // latest first
};

EmotionalStateSchema.statics.getByDate = function (
  userId: mongoose.Types.ObjectId,
  date: string
) {
  const start = new Date(date);
  const end = new Date(date);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return this.find({
    userId,
    createdAt: {
      $gte: start,
      $lte: end,
    },
  }).sort({ createdAt: -1 }); // newest first
};

EmotionalStateSchema.statics.findByRange = async function (
  userId: string,
  start: Date,
  end: Date
) {
  return this.find({
    userId,
    createdAt: { $gte: start, $lte: end },
  });
};

EmotionalStateSchema.statics.findByRangeGrouped = function (
  userId: string,
  start: string,
  end: string,
  timezone: string = "UTC"
) {

  const { startUTC, endUTC } = toUtcBoundsForLocalRange(start, end, timezone);

  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startUTC, $lte: endUTC } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: timezone } },
        emotions: {
          $push: {
            _id: "$_id",
            state: "$state",
            intensity: "$intensity",
            note: "$note",
            createdAt: "$createdAt",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

// --------------------
// Model
// --------------------
const EmotionalState = mongoose.model<IEmotionalState, IEmotionalStateModel>(
  "EmotionalState",
  EmotionalStateSchema
);
export default EmotionalState;
