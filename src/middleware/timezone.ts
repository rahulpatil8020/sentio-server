import { NextFunction, Request, Response } from "express";
import moment from "moment-timezone";

declare global {
    namespace Express {
        interface Request {
            timezone?: string;
        }
    }
}

export const validateTimezone = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const tz = req.header("X-Timezone");

    if (!tz || !moment.tz.zone(tz)) {
        req.timezone = "UTC"; // fallback
    } else {
        req.timezone = tz;
    }

    next();
};