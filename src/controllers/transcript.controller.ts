// import { Request, Response } from "express";
// import { processTranscriptService } from "../services/transcript.service";

// export const processTranscript = async (req: Request, res: Response) => {
//   const { transcript, userId } = req.body;

//   if (!transcript || !userId) {
//     return res
//       .status(400)
//       .json({ message: "transcript and userId are required" });
//   }
//   const dashboard = await processTranscriptService(userId, transcript);
//   res.status(201).json({ dashboard });
// };

import { Request, Response } from "express";
import {
  createTranscriptEntry,
  processTranscriptEntry,
} from "../services/transcript.service";

export const processTranscript = async (req: Request, res: Response) => {
  const { transcript, userId } = req.body;

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