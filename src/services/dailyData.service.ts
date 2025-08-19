import Habit from "../models/habit.model";
import Todo from "../models/todo.model";
import Reminder from "../models/reminder.model";
import EmotionalState from "../models/emotionalstate.model";
import Transcript from "../models/transcript.model";


export const getDailyData = async (
    userId: string,
    day: string,
    timezone?: string
) => {

    const start = day, end = day
    const [
        todos,
        emotions,
        transcripts,
    ] = await Promise.all([
        Todo.findCompletedByRangeFlat(userId, start, end, timezone),
        EmotionalState.findByRangeFlat(userId, start, end, timezone),
        Transcript.findByRangeFlat(userId, start, end, timezone),
    ]);

    // 🔹 Flattened structure
    const dailyData = {
        todos,
        emotions,
        transcripts,
    };

    return dailyData;

};


export const getTodaysData = async (
    userId: string,
    day: string,
    timezone?: string
) => {
    const start = day, end = day;

    const [
        habits,
        todos,
        upcomingReminders,
        emotions,
        transcripts,
    ] = await Promise.all([
        Habit.findActiveHabitsByUserId(userId),
        Todo.findIncompleteTodoByUserId(userId),
        Reminder.findUpcomingByUserId(userId),
        EmotionalState.findByRangeFlat(userId, start, end, timezone),
        Transcript.findByRangeFlat(userId, start, end, timezone),
    ]);

    // 🔹 Flattened structure
    const dailyData = {
        habits,
        todos,
        reminders: upcomingReminders,
        emotions,
        transcripts,
    };

    return dailyData;
};