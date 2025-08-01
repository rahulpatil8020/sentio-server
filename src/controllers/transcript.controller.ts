

import { Response } from "express";
import {
  createTranscriptEntry,
  processTranscriptEntry,
} from "../services/transcript.service";
import { AuthenticatedRequest } from "../types/authRequest.types";

export const processTranscript = async (req: AuthenticatedRequest, res: Response) => {
  const { transcript } = req.body;
  const userId = req.user?.userId;

  if (!transcript || !userId) {
    return res
      .status(400)
      .json({ message: "transcript and userId are required" });
  }

  try {
    // Step 1: Save the raw transcript
    const transcriptDoc = await createTranscriptEntry(userId, transcript);

    // Step 2: Process the transcript and update it with Gemini response
    const dashboard = await processTranscriptEntry(userId, transcriptDoc);

    return res.status(201).json({ dashboard });
  } catch (err) {
    console.error("❌ Error in processing transcript:", err);
    return res.status(500).json({
      message: "Transcript could not be processed. Please try again later.",
    });
  }
};