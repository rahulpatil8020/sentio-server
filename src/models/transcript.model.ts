import mongoose, { Document, Schema, Model } from "mongoose";

// --------------------
// Transcript Interface
// --------------------
export interface ITranscript extends Document {
  userId: mongoose.Types.ObjectId;
  text: string;
  openAiResponse: any; // Can be OpenAI.Chat.Completions.ChatCompletion if you want to type it
  summary: string;
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
}

// --------------------
// Schema Definition
// --------------------
const TranscriptSchema: Schema<ITranscript> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    openAiResponse: { type: Schema.Types.Mixed, required: true },
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

// --------------------
// Model
// --------------------
const Transcript = mongoose.model<ITranscript, ITranscriptModel>(
  "Transcript",
  TranscriptSchema
);

export default Transcript;
