import { Request, Response } from "express";
import * as authService from "../services/user.service";
import { AuthError } from "../utils/errors/errors";
import { AuthenticatedRequest } from "../types/authRequest.types";
import * as userService from "../services/user.service";

// POST /user/onboard
export const onboardUser = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    const { city, country, profession, goals } = req.body;

    const user = await userService.onboardUser(userId, {
        city,
        country,
        profession,
        goals,
        isOnboarded: true,
    });

    res.status(200).json({
        success: true,
        message: "User onboarded successfully",
        data: { user },
    });
};