import { z } from "zod";

export const TranscriptSchema = z.object({
  userId: z.string().min(1).max(255),
  transcript: z.string().min(1),
});
