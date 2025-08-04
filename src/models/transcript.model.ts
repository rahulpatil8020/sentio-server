import mongoose, { Document, Schema, Model } from "mongoose";

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
  getSummaryByDate(userId: string, date: string): Promise<ITranscript | null>;
  getSummariesByDate(userId: string, date: string): Promise<ITranscript[]>;
  getTranscriptsByDate(userId: string, date: string): Promise<ITranscript[]>;
  getTranscriptsByRange(userId: string, start: Date, end: Date): Promise<ITranscript[]>;
  getSummariesByRange(userId: string, start: Date, end: Date): Promise<ITranscript[]>;
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

TranscriptSchema.statics.getSummaryByDate = function (
  userId: string,
  date: string
) {
  const start = new Date(date);
  const end = new Date(date);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return this.findOne({
    userId,
    createdAt: { $gte: start, $lte: end },
    summary: { $exists: true, $ne: "" },
  }).select("summary createdAt");
};

TranscriptSchema.statics.getSummariesByDate = function (
  userId: string,
  date: string
) {
  const start = new Date(date);
  const end = new Date(date);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return this.find({
    userId,
    createdAt: { $gte: start, $lte: end },
    summary: { $exists: true, $ne: "" },
  })
    .sort({ createdAt: -1 }) // optional: newest first
    .select("summary createdAt");
};

TranscriptSchema.statics.getTranscriptsByDate = function (
  userId: string,
  date: string
) {
  const start = new Date(date);
  const end = new Date(date);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return this.find({
    userId,
    createdAt: { $gte: start, $lte: end },
  }).sort({ createdAt: -1 }); // optional: newest first
};

TranscriptSchema.statics.getTranscriptsByRange = function (
  userId: string,
  start: Date,
  end: Date
) {
  return this.find(
    {
      userId,
      createdAt: { $gte: start, $lte: end },
    },
    { _id: 1, text: 1, createdAt: 1 } // 👈 only include text, exclude _id
  );
};

TranscriptSchema.statics.getSummariesByRange = function (
  userId: string,
  start: Date,
  end: Date
) {
  return this.find({
    userId,
    createdAt: { $gte: start, $lte: end },
    summary: { $exists: true, $ne: "" },
  })
    .sort({ createdAt: -1 }) // optional: newest first
    .select("summary createdAt");
};

// --------------------
// Model
// --------------------
const Transcript = mongoose.model<ITranscript, ITranscriptModel>(
  "Transcript",
  TranscriptSchema
);

export default Transcript;
