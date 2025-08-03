import { Response } from "express";
import { AuthenticatedRequest } from "../types/authRequest.types";
import * as dailyDataService from "../services/dailyData.service";

export const getDailyData = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.userId;
    const { start, end } = req.query;

    if (!start || !end || typeof start !== "string" || typeof end !== "string") {
        return res.status(400).json({
            success: false,
            message: "Missing or invalid 'start' and 'end' query parameters (must be ISO datetime)",
        });
    }

    const data = await dailyDataService.getDailyDataInRange(userId, start, end);

    res.status(200).json({
        success: true,
        message: `Daily data from ${start} to ${end} fetched successfully`,
        data,
    });
};