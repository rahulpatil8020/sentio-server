import * as habitService from "./habit.service";
import * as todoService from "./todo.service";
import * as reminderService from "./reminder.service";
import * as emotionService from "./emotionalstate.service";
import * as transcript from "./transcript.service";
// import * as summaryService from "./summary.service";


export const getDailyDataByDate = async (userId: string, date: string) => {
    const [habits, todos, reminders, emotions, summaries, transcripts] = await Promise.all([
        habitService.getActiveHabitsByUserId(userId),
        todoService.getIncompleteTodosByUserId(userId),
        reminderService.getRemindersByDate(userId, date),
        emotionService.getEmotionsByDate(userId, date),
        transcript.getSummariesByDate(userId, date),
        transcript.getTranscriptsByDate(userId, date),
    ]);

    return {
        date,
        habits,
        todos,
        reminders,
        emotions,
        summaries,
        transcripts,
    };
};

export const getDailyDataInRange = async (
    userId: string,
    startDate: string,
    endDate: string
) => {
    const dateRange = generateDateRange(startDate, endDate); // ["2025-07-26", "2025-07-27", ..., "2025-07-28"]

    const results = await Promise.all(
        dateRange.map(async (date) => {
            const [habits, todos, reminders, emotions, summaries, transcripts] = await Promise.all([
                habitService.getActiveHabitsByUserId(userId),
                todoService.getIncompleteTodosByUserId(userId),
                reminderService.getRemindersByDate(userId, date),
                emotionService.getEmotionsByDate(userId, date),
                transcript.getSummaryByDate(userId, date).catch(() => null), // in case not found
                transcript.getTranscriptsByDate(userId, date),
            ]);

            return {
                date,
                habits,
                todos,
                reminders,
                emotions,
                summaries,
                transcripts,
            };
        })
    );

    return results;
};

function generateDateRange(start: string, end: string): string[] {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates: string[] = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const iso = d.toISOString().split("T")[0]; // YYYY-MM-DD
        dates.push(iso);
    }

    return dates;
}