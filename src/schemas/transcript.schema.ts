import { z } from "zod";

export const TranscriptSchema = z.object({
  transcript: z.string().min(1),
});
