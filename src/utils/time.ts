// utils/time.ts
import moment from "moment-timezone";

/** Convert a local YYYY-MM-DD day into UTC bounds for querying Mongo. */
export function toUtcBoundsForLocalDay(dateISO: string, tz: string) {
    const startLocal = moment.tz(dateISO, tz).startOf("day");
    const endLocal = moment.tz(dateISO, tz).endOf("day");
    return {
        startUTC: startLocal.clone().utc().toDate(),
        endUTC: endLocal.clone().utc().toDate(),
    };
}

/** Convert a local inclusive range of days to UTC bounds. */
export function toUtcBoundsForLocalRange(startISO: string, endISO: string, tz: string) {
    const startLocal = moment.tz(startISO, tz).startOf("day");
    const endLocal = moment.tz(endISO, tz).endOf("day");
    return {
        startUTC: startLocal.clone().utc().toDate(),
        endUTC: endLocal.clone().utc().toDate(),
    };
}