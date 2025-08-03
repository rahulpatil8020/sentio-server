import * as habitService from "./habit.service";
import * as todoService from "./todo.service";
import * as reminderService from "./reminder.service";
import * as emotionService from "./emotionalstate.service";
import * as transcript from "./transcript.service";
// import * as summaryService from "./summary.service";

export const getDailyDataInRange = async (
    userId: string,
    start: string,
    end: string
) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const [habits, todos, reminders, emotions, summaries, transcripts] = await Promise.all([
        habitService.getActiveHabitsByUserId(userId), // might not need per-range
        todoService.getTodosByRange(userId, startDate, endDate),
        reminderService.getRemindersByRange(userId, startDate, endDate),
        emotionService.getEmotionsByRange(userId, startDate, endDate),
        transcript.getSummariesByRange(userId, startDate, endDate),
        transcript.getTranscriptsByRange(userId, startDate, endDate),
    ]);

    return {
        start,
        end,
        habits,
        todos,
        reminders,
        emotions,
        summaries,
        transcripts,
    };
};