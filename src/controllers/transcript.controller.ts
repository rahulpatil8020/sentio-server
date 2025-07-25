import { Request, Response } from "express";
import { processTranscriptService } from "../services/transcript.service";

export const processTranscript = async (req: Request, res: Response) => {
  const { transcript, userId } = req.body;

  if (!transcript || !userId) {
    return res
      .status(400)
      .json({ message: "transcript and userId are required" });
  }
  const dashboard = await processTranscriptService(userId, transcript);
  res.status(201).json({ dashboard });
};
