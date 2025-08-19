import { Response } from "express";
import { AuthenticatedRequest } from "../types/authRequest.types";
import * as dailyDataService from "../services/dailyData.service";

export const getDailyData = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.userId;
    const { day } = req.query;
    const timezone = req.timezone!;

    if (!day || typeof day !== "string") {
        return res.status(400).json({
            success: false,
            message: "Missing or invalid 'start' and 'end' query parameters (must be ISO datetime)",
        });
    }

    const data = await dailyDataService.getDailyData(userId, day, timezone);

    res.status(200).json({
        success: true,
        message: `Daily data for ${day} fetched successfully`,
        data,
    });
};

export const getTodaysData = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.userId;
    const { day } = req.query;
    const timezone = req.timezone!;

    if (!day || typeof day !== "string") {
        return res.status(400).json({
            success: false,
            message: "Missing or invalid day query parameters (must be ISO datetime)",
        });
    }

    const data = await dailyDataService.getTodaysData(userId, day, timezone);

    res.status(200).json({
        success: true,
        message: `Todays data for ${day} fetched successfully`,
        data,
    });
};
