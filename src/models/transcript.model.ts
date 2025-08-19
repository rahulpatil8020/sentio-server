import mongoose, { Document, Schema, Model } from "mongoose";
import { toUtcBoundsForLocalRange } from "../utils/time";

// --------------------
// Transcript Interface
// --------------------
export interface ITranscript extends Document {
  userId: mongoose.Types.ObjectId;
  text: string;
  openAiResponse?: any; // Can be OpenAI.Chat.Completions.ChatCompletion if you want to type it
  summary?: string;
  createdAt: Date;
}

// --------------------
// Static Methods Interface
// --------------------
interface ITranscriptModel extends Model<ITranscript> {
  findByUser(userId: string): Promise<ITranscript[]>;
  findTranscriptById(id: string): Promise<ITranscript | null>;
  createTranscript(data: Partial<ITranscript>): Promise<ITranscript>;
  deleteTranscriptById(id: string): Promise<ITranscript | null>;
  findByRangeGrouped(userId: string, start: string, end: string, timezone?: string): Promise<any>;
  findByRangeFlat(userId: string, start: string, end: string, timezone?: string): Promise<any>;
}

// --------------------
// Schema Definition
// --------------------
const TranscriptSchema: Schema<ITranscript> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    openAiResponse: { type: Schema.Types.Mixed },
    summary: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

// --------------------
// Static Methods
// --------------------
TranscriptSchema.statics.findByUser = function (userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 }); // latest first
};

TranscriptSchema.statics.findTranscriptById = function (id: string) {
  return this.findById(id);
};

TranscriptSchema.statics.createTranscript = function (
  data: Partial<ITranscript>
) {
  return this.create(data);
};

TranscriptSchema.statics.deleteTranscriptById = function (id: string) {
  return this.findByIdAndDelete(id);
};

TranscriptSchema.statics.getSummariesForLast7Days = function (userId: string) {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6); // include today

  return this.find({
    userId,
    createdAt: {
      $gte: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)), // start of 7 days ago
      $lte: new Date(today.setHours(23, 59, 59, 999)), // end of today
    },
    summary: { $exists: true, $ne: "" }, // only transcripts with summary
  })
    .sort({ createdAt: -1 }) // latest first
    .select("summary createdAt"); // only fetch summary + date
};

TranscriptSchema.statics.findByRangeGrouped = function (
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
        transcripts: {
          $push: {
            _id: "$_id",
            text: "$text",
            createdAt: "$createdAt",
            summary: "$summary",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

TranscriptSchema.statics.findByRangeFlat = function (
  userId: string,
  start: string,
  end: string,
  timezone: string = "UTC"
) {
  const { startUTC, endUTC } = toUtcBoundsForLocalRange(start, end, timezone);

  return this.find(
    {
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: { $gte: startUTC, $lte: endUTC },
    },
    // projection: only what you need
    { _id: 1, text: 1, createdAt: 1, summary: 1 }
  ).sort({ createdAt: 1 }); // or -1 for newest first
};

// --------------------
// Model
// --------------------
const Transcript = mongoose.model<ITranscript, ITranscriptModel>(
  "Transcript",
  TranscriptSchema
);

export default Transcript;
