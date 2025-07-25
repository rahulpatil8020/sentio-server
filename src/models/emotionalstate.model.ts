import mongoose, { Document, Schema, Model } from "mongoose";

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
  getLast7DaysByUserId(userId: string): Promise<IEmotionalState[]>;
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

// --------------------
// Model
// --------------------
const EmotionalState = mongoose.model<IEmotionalState, IEmotionalStateModel>(
  "EmotionalState",
  EmotionalStateSchema
);
export default EmotionalState;
